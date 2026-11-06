import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";
import { safeNextPath } from "@/lib/supabase/auth-shared";

interface SignupContentProps {
  searchParams: Promise<{
    accountType?: string;
    error?: string;
    next?: string;
  }>;
}

export default async function SignupContent({
  searchParams,
}: SignupContentProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <AuthShell
        eyebrow="Your housing journey"
        title="Start with the right role."
        description="Choose Tenant to find and track a place, or Landlord to manage student accommodation. Your workspace will match your choice."
        secondaryText="Already have an account?"
        secondaryHref={`/login?next=${encodeURIComponent(nextPath)}`}
        secondaryLinkLabel="Sign in"
      >
        <SignupForm
          initialAccountType={
            params.accountType === "provider"
              ? "provider"
              : params.accountType === "student"
                ? "student"
                : null
          }
          nextPath={nextPath}
          error={params.error}
          startAtDetails={Boolean(params.error)}
        />
      </AuthShell>
    </div>
  );
}
