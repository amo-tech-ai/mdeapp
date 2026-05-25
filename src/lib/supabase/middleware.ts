import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

const PROTECTED_PREFIXES = ["/host", "/trips", "/saved"];

/**
 * Supabase falls back to Site URL with `?code=` when redirectTo is missing from
 * the allowlist or does not match (common www vs apex / env mismatch on prod).
 */
function relaySupabaseAuthQuery(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname === "/auth/callback") {
    return null;
  }

  const authError = searchParams.get("error");
  if (authError) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("error", authError);
    return NextResponse.redirect(redirectUrl);
  }

  const code = searchParams.get("code");
  if (!code) {
    return null;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/auth/callback";
  return NextResponse.redirect(redirectUrl);
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function updateSession(request: NextRequest) {
  const authRelay = relaySupabaseAuthQuery(request);
  if (authRelay) {
    return authRelay;
  }

  let supabaseResponse = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    isProtectedPath(request.nextUrl.pathname) &&
    process.env.E2E_BYPASS_AUTH !== "1"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
