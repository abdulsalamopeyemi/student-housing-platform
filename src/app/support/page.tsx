import Link from "next/link";
import { Suspense } from "react";

import { submitSupportRequest } from "@/app/support/actions";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { getCurrentAccount } from "@/lib/data/account";
import { SUPPORT_EMAIL } from "@/lib/support";

interface SupportPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

const categories = [
  ["account", "My account"],
  ["property", "A property listing"],
  ["inspection", "An inspection request"],
  ["payment", "A payment"],
  ["privacy", "Privacy or personal data"],
  ["other", "Something else"],
];

async function SupportContent({ searchParams }: SupportPageProps) {
  const [{ user }, params] = await Promise.all([
    getCurrentAccount(),
    searchParams,
  ]);

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
          Support desk
        </p>
        <h1 className="mt-3 max-w-lg text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
          We’ll help you find the right next step.
        </h1>
        <p className="mt-5 max-w-xl leading-7 text-[var(--muted)]">
          Tell us what happened and include only the details we need to help.
          Don’t send passwords, verification codes, or payment card details.
        </p>

        <div className="mt-8 border-l-2 border-[var(--gold)] pl-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Prefer email?
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-2 inline-flex font-semibold text-[var(--forest)] underline decoration-[var(--gold)] underline-offset-4"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-[var(--forest)]">
          Send a support request
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          {user?.email
            ? `We’ll reply to ${user.email}.`
            : "Sign in to send a request through the platform. You can email us without an account."}
        </p>

        {params.error ? (
          <p
            role="alert"
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          >
            {params.error}
          </p>
        ) : null}
        {params.message ? (
          <p
            role="status"
            className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
          >
            {params.message}
          </p>
        ) : null}

        {user ? (
          <form action={submitSupportRequest} className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                Topic
              </span>
              <select
                required
                name="category"
                defaultValue=""
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-[var(--emerald)]"
              >
                <option value="" disabled>
                  Choose a topic
                </option>
                {categories.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                Subject
              </span>
              <input
                required
                minLength={5}
                maxLength={120}
                name="subject"
                className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                How can we help?
              </span>
              <textarea
                required
                minLength={20}
                maxLength={2000}
                rows={6}
                name="message"
                className="w-full resize-y rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
              />
              <span className="mt-1.5 block text-xs text-[var(--muted)]">
                Use 20 to 2,000 characters. Never include a password, sign-in
                code, or card number.
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--forest)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--emerald)]"
            >
              Send support request
            </button>
            <p className="text-xs leading-5 text-[var(--muted)]">
              Your request is visible only to you and authorized support
              administrators.
            </p>
          </form>
        ) : (
          <Link
            href="/login?next=%2Fsupport"
            className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
          >
            Sign in to contact support
          </Link>
        )}
      </section>
    </div>
  );
}

export default function SupportPage({ searchParams }: SupportPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[var(--paper)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl animate-pulse px-5 py-16 lg:px-8">
              <div className="h-12 max-w-lg rounded-xl bg-[var(--cream)]" />
              <div className="mt-8 h-80 rounded-3xl bg-white" />
            </div>
          }
        >
          <SupportContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
