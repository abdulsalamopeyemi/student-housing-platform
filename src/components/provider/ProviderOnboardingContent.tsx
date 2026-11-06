import Link from "next/link";
import { redirect } from "next/navigation";

import { createLandlordProfile } from "@/app/provider/onboarding/actions";
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
  const [{ user, provider }, params] = await Promise.all([
    getCurrentProvider(),
    searchParams,
  ]);

  const suggestedDisplayName = user?.user_metadata?.full_name ?? "";
  const nextPath = params.next ? safeNextPath(params.next) : "/list-property";

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/provider/onboarding?next=${nextPath}`)}`);
  }

  if (provider) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Landlord account
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--forest)]">
            Your landlord profile is ready.
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
          Landlord setup
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
          Set up your landlord profile.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
          Your landlord login is already created. This step links a landlord
          profile to that same account so your properties and verification
          review have an owner. You are not creating a second account.
        </p>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5">
          <p className="text-sm font-bold text-[var(--forest)]">
            One login, one landlord workspace
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Use your name or property business name. You can add and manage
            your property listings from this account.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Profile details
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--forest)]">
          Where should listings appear?
        </h2>

        {params.error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {params.error}
          </div>
        ) : null}

        <form action={createLandlordProfile} className="mt-6 space-y-5">
          <input type="hidden" name="next" value={nextPath} />

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Landlord or business name
            </span>
            <input
              required
              name="displayName"
              type="text"
              minLength={2}
              maxLength={120}
              defaultValue={suggestedDisplayName}
              placeholder="Your full name or property business"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>

          <div className="rounded-2xl bg-[var(--cream)] p-4 text-sm leading-6 text-[var(--muted)]">
            Your landlord profile begins as <strong>unverified</strong>.
            Verification is a separate review; setting up your workspace does
            not grant a verified badge.
          </div>

          <button className="w-full rounded-xl bg-[var(--forest)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--emerald)]">
            Continue to my landlord workspace
          </button>
        </form>
      </section>
    </div>
  );
}
