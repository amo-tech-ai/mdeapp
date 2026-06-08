import Link from "next/link";
import { PartnerSignupWizard } from "@/components/partners/partner-signup-wizard";
import { getServerUser } from "@/lib/auth/session";
import {
  parsePartnerSignupSearchParams,
  PARTNER_TYPE_LABELS,
} from "@/lib/partners/parse-partner-signup-params";
import { PARTNER_TYPES } from "@/lib/partners/partner-types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Partner signup · mdeai",
};

type PartnerSignupPageProps = {
  searchParams: Promise<{ type?: string | string[]; draft?: string | string[] }>;
};

function buildSignupPath(type: string, draft?: string) {
  const params = new URLSearchParams({ type });
  if (draft) params.set("draft", draft);
  return `/partners/signup?${params.toString()}`;
}

export default async function PartnerSignupPage({
  searchParams,
}: PartnerSignupPageProps) {
  const params = await searchParams;
  const { type, draftId, typeParam } = parsePartnerSignupSearchParams(params);

  if (!type) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-lg" data-testid="partner-signup-type-picker">
          <CardHeader>
            <CardTitle>Choose partner type</CardTitle>
            <CardDescription>
              {typeParam
                ? `"${typeParam}" is not a valid partner type. Pick one below.`
                : "Select the partner program that matches your business."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {PARTNER_TYPES.map((partnerType) => (
              <Link
                key={partnerType}
                href={buildSignupPath(partnerType, draftId)}
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              >
                {PARTNER_TYPE_LABELS[partnerType]}
              </Link>
            ))}
          </CardContent>
        </Card>
      </main>
    );
  }

  const { user } = await getServerUser();
  const loginNextPath = buildSignupPath(type, draftId);

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-background">
      <PartnerSignupWizard
        partnerType={type}
        draftId={draftId}
        isAuthenticated={Boolean(user)}
        loginNextPath={loginNextPath}
      />
    </main>
  );
}
