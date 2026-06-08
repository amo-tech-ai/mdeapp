import type { ActivatePartnerInput } from "@/lib/partners/activate-schema";
import { assertAllowedSignupSettings } from "@/lib/partners/activate-schema";
import {
  PARTNER_ACTIVATE_REDIRECT,
  type PartnerType,
} from "@/lib/partners/partner-types";

export type PartnerSignupFormState = {
  businessName: string;
  category?: string;
  neighborhood?: string;
};

export type ActivatePartnerResponse = {
  partnerId: string;
  type: PartnerType;
  status: "draft";
  redirectTo: string;
};

export type ActivatePartnerResult =
  | {
      ok: true;
      status: 201 | 200;
      created: boolean;
      data: ActivatePartnerResponse;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

export function buildActivatePayload(
  type: PartnerType,
  form: PartnerSignupFormState,
  draftId?: string,
): ActivatePartnerInput {
  const settings: Record<string, unknown> = {};
  const businessName = form.businessName.trim();
  const category = form.category?.trim();
  const neighborhood = form.neighborhood?.trim();

  if (businessName) settings.businessName = businessName;
  if (category) settings.category = category;
  if (neighborhood) settings.neighborhood = neighborhood;

  return {
    type,
    ...(draftId ? { draftId } : {}),
    ...(Object.keys(settings).length > 0 ? { settings } : {}),
  };
}

export function assertSafeActivatePayload(payload: ActivatePartnerInput): void {
  assertAllowedSignupSettings(payload.settings);
}

export function shouldDeferDashboardRedirect(redirectTo: string): boolean {
  return redirectTo === PARTNER_ACTIVATE_REDIRECT;
}

export async function activatePartnerRequest(
  payload: ActivatePartnerInput,
  fetchImpl: typeof fetch = fetch,
): Promise<ActivatePartnerResult> {
  assertSafeActivatePayload(payload);

  let res: Response;
  try {
    res = await fetchImpl("/api/partners/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Partner activation failed";
    return { ok: false, status: 0, message };
  }

  let body: {
    error?: string;
    partnerId?: string;
    type?: PartnerType;
    status?: "draft";
    redirectTo?: string;
  } = {};
  try {
    body = (await res.json()) as typeof body;
  } catch {
    body = {};
  }

  if (res.ok && body.partnerId && body.redirectTo) {
    return {
      ok: true,
      status: res.status as 201 | 200,
      created: res.status === 201,
      data: {
        partnerId: body.partnerId,
        type: payload.type,
        status: "draft",
        redirectTo: body.redirectTo,
      },
    };
  }

  const message =
    typeof body.error === "string" && body.error.length > 0
      ? body.error
      : "Partner activation failed";

  return { ok: false, status: res.status, message };
}

export function activateErrorMessage(status: number, message: string): string {
  if (status === 401) return "Sign in to activate your partner account.";
  if (status === 400) return message;
  if (status === 403) return message;
  if (status === 404) return message;
  return "Something went wrong. Please try again.";
}
