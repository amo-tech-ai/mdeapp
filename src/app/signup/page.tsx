import { AuthEmailForm } from "@/components/auth/auth-email-form";
import { safeNextPath } from "@/lib/auth/site-url";

type SignupPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-background">
      <AuthEmailForm mode="signup" nextPath={nextPath} />
    </main>
  );
}
