import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/auth/actions";
import { getCurrentProvider } from "@/lib/data/providers";

interface ProviderWorkspaceContentProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

export default async function ProviderWorkspaceContent({
  searchParams,
}: ProviderWorkspaceContentProps) {
  const [{ user, provider }, params] = await Promise.all([
    getCurrentProvider(),
    searchParams,
  ]);

  if (!user) {
    redirect("/login?next=/list-property");
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
      {params.message ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          {params.message}
        </div>
      ) : null}

      <div className="flex flex-col gap-6 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Provider workspace
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)]">
            {provider.display_name ?? "Your property workspace"}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
            Your provider profile is active in the system. The next build step
            is the real property-submission form that will create a draft
            listing tied to this provider account.
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--cream)] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Verification
          </p>
          <p className="mt-1 font-bold capitalize text-[var(--forest)]">
            {provider.verification_status}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">
            1. Provider profile
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Complete</p>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">
            2. Property details
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Next implementation
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">
            3. Submit for review
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            After property data is complete
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/explore"
          className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)]"
        >
          View marketplace
        </Link>
        <form action={signOut}>
          <button className="rounded-xl px-5 py-3 text-sm font-semibold text-[var(--muted)] underline underline-offset-4">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
