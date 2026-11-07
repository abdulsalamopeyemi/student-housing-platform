import Link from "next/link";
import { Suspense } from "react";

import { requestPasswordReset } from "@/app/login/actions";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface ForgotPasswordPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

async function ForgotPasswordContent({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <section className="mx-auto max-w-xl px-5 py-16 lg:py-24">
      <div className="border-l-4 border-[var(--gold)] pl-5">
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
          Account access
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)]">
          A fresh key for your account.
        </h1>
        <p className="mt-4 leading-7 text-[var(--muted)]">
          Enter the email you used to sign up. If an account matches, we’ll
          send a secure link to choose a new password.
        </p>
      </div>

      {params.error ? (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {params.error}
        </p>
      ) : null}

      {params.message ? (
        <p
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          {params.message}
        </p>
      ) : null}

      <form
        action={requestPasswordReset}
        className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Email address
          </span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
          />
        </label>

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-[var(--forest)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--emerald)]"
        >
          Send reset link
        </button>
      </form>

      <Link
        href="/login"
        className="mt-6 inline-flex text-sm font-semibold text-[var(--forest)] underline decoration-[var(--gold)] underline-offset-4"
      >
        Return to sign in
      </Link>
    </section>
  );
}

export default function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[var(--paper)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-xl animate-pulse px-5 py-16">
              <div className="h-10 w-3/4 rounded-xl bg-[var(--cream)]" />
              <div className="mt-5 h-24 rounded-2xl bg-white" />
            </div>
          }
        >
          <ForgotPasswordContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
