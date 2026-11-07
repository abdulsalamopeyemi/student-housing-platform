import Link from "next/link";

import { login, resendConfirmation } from "@/app/login/actions";
import AuthShell from "@/components/auth/AuthShell";
import PasswordField from "@/components/auth/PasswordField";
import ActionSubmitButton from "@/components/ui/ActionSubmitButton";
import { safeNextPath } from "@/lib/supabase/auth-shared";

interface SigninContentProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
}

export default async function SigninContent({
  searchParams,
}: SigninContentProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <AuthShell
        eyebrow="Welcome back"
        title="Pick up where your search left off."
        description="Sign in to revisit saved homes, manage inspection requests, or continue with your property workspace."
        secondaryText="New to Student Housing?"
        secondaryHref={`/signup?next=${encodeURIComponent(nextPath)}`}
        secondaryLinkLabel="Create an account"
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--auth-green)]">
          Sign in
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--auth-ink)] sm:text-4xl">
          Good to see you.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--auth-muted)]">
          Enter your email and password to continue.
        </p>

        {params.error ? (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-800"
          >
            {params.error}
          </div>
        ) : null}

        {params.message ? (
          <div
            role="status"
            className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-900"
          >
            {params.message}
          </div>
        ) : null}

        <form action={login} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[var(--auth-ink)]">
              Email address
            </span>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              className="auth-input"
            />
          </label>

          <PasswordField
            name="password"
            label="Password"
            autoComplete="current-password"
            backgroundClassName="bg-white"
          />

          <div className="-mt-1 text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold text-[var(--auth-green)] underline decoration-[var(--auth-citrus)] decoration-2 underline-offset-4 transition hover:text-[var(--auth-pine)]"
            >
              Forgot password?
            </Link>
          </div>

          <ActionSubmitButton
            pendingText="Signing you in…"
            className="auth-primary-button"
          >
            Sign in
          </ActionSubmitButton>
        </form>

        <details className="group mt-7 border-t border-[var(--auth-line)] pt-5">
          <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--auth-pine)] marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--auth-green)]">
            <span className="flex items-center justify-between">
              Need a new confirmation email?
              <span
                aria-hidden="true"
                className="text-lg transition-transform group-open:rotate-45"
              >
                +
              </span>
            </span>
          </summary>
          <p className="mt-3 text-xs leading-5 text-[var(--auth-muted)]">
            Enter the email you registered with. We won&apos;t reveal whether
            an account exists.
          </p>
          <form action={resendConfirmation} className="mt-3 space-y-3">
            <input type="hidden" name="next" value={nextPath} />
            <label className="block">
              <span className="sr-only">Email for confirmation resend</span>
              <input
                required
                type="email"
                name="resendEmail"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                placeholder="you@example.com"
                className="auth-input"
              />
            </label>
            <ActionSubmitButton
              pendingText="Requesting email…"
              className="auth-secondary-button"
            >
              Resend confirmation email
            </ActionSubmitButton>
          </form>
        </details>

        <Link
          href="/explore"
          className="mt-5 inline-flex text-sm font-medium text-[var(--auth-muted)] underline underline-offset-4 transition hover:text-[var(--auth-pine)]"
        >
          Continue browsing homes
        </Link>
      </AuthShell>
    </div>
  );
}
