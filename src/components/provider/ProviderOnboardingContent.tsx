import Link from "next/link";

import { createProvider } from "@/app/provider/onboarding/actions";
import { getCurrentProvider } from "@/lib/data/providers";
import { safeNextPath } from "@/lib/supabase/auth-shared";

interface ProviderOnboardingContentProps {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
}

export default async function ProviderOnboardingContent({
  searchParams,
}: ProviderOnboardingContentProps) {
  const [{ provider }, params] = await Promise.all([
    getCurrentProvider(),
    searchParams,
  ]);

  const nextPath = params.next ? safeNextPath(params.next) : "/list-property";

  if (provider) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Provider account
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--forest)]">
            Your provider profile already exists.
          </h1>
          <p className="mt-4 leading-7 text-[var(--muted)]">
            Verification status:{" "}
            <span className="font-semibold text-[var(--forest)]">
              {provider.verification_status}
            </span>
          </p>
          <Link
            href={nextPath}
            className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
          >
            Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
          Provider onboarding
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
          Tell us how you manage student accommodation.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
          Creating a provider profile does not make an account verified. It
          gives you a secure workspace for submitting property information for
          review.
        </p>

        <div className="mt-8 space-y-4 text-sm leading-6 text-[var(--muted)]">
          <p>• Landlords can manage properties they own.</p>
          <p>• Agents manage properties that a property owner assigns to their verified account.</p>
          <p>• Property managers can manage accommodation on behalf of owners.</p>
        </div>
      </div>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-[var(--forest)]">
          Create your provider profile
        </h2>

        {params.error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {params.error}
          </div>
        ) : null}

        <form action={createProvider} className="mt-6 space-y-5">
          <input type="hidden" name="next" value={nextPath} />

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Provider / business name
            </span>
            <input
              required
              name="displayName"
              type="text"
              placeholder="e.g. De Crown Property Services"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              How do you operate?
            </span>
            <select
              required
              name="providerType"
              defaultValue=""
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-[var(--emerald)]"
            >
              <option value="" disabled>
                Choose provider type
              </option>
              <option value="landlord">Landlord / property owner</option>
              <option value="agent">Authorized agent</option>
              <option value="property_manager">Property manager</option>
            </select>
          </label>

          <div className="rounded-2xl bg-[var(--cream)] p-4 text-sm leading-6 text-[var(--muted)]">
            Your profile begins as <strong>unverified</strong>. Verification
            is a separate review process; creating this profile does not grant
            a verified badge.
          </div>

          <button className="w-full rounded-xl bg-[var(--forest)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--emerald)]">
            Create provider profile and continue
          </button>
        </form>
      </section>
    </div>
  );
}
