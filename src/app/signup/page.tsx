import { AuthEmailForm } from "@/components/auth/auth-email-form";
import { AuthExistingSession } from "@/components/auth/auth-existing-session";
import { getServerUser } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/auth/site-url";

type SignupPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const { user } = await getServerUser();

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-background">
      {user?.email ? (
        <AuthExistingSession
          email={user.email}
          nextPath={nextPath}
          mode="signup"
        />
      ) : (
        <AuthEmailForm mode="signup" nextPath={nextPath} />
      )}
    </main>
  );
}
