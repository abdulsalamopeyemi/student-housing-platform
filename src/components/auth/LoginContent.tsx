import Link from "next/link";

import {
  login,
  resendConfirmation,
  signup,
} from "@/app/login/actions";
import PasswordField from "@/components/auth/PasswordField";
import { safeNextPath } from "@/lib/supabase/auth-shared";

interface LoginContentProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
}

export default async function LoginContent({
  searchParams,
}: LoginContentProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
          Your account
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
          Sign in or create your account.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          Students will use accounts for saved homes and inspection history.
          Property providers will use the same secure account system before
          creating and managing listings.
        </p>
      </div>

      {params.error ? (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {params.error}
        </div>
      ) : null}

      {params.message ? (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          {params.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            Sign in
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--forest)]">
            Welcome back
          </h2>

          <form action={login} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={nextPath} />

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                Email
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

            <PasswordField
              name="password"
              label="Password"
              autoComplete="current-password"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--forest)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--emerald)]"
            >
              Sign in
            </button>
          </form>

          <div className="mt-8 border-t border-[var(--border)] pt-6">
            <h3 className="font-bold text-[var(--forest)]">
              Didn&apos;t receive the confirmation email?
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Enter the same email you used to register. We&apos;ll request a
              new confirmation message without revealing whether an account
              exists.
            </p>

            <form action={resendConfirmation} className="mt-4 space-y-3">
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
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-xl border border-[var(--border)] px-5 py-3 font-semibold text-[var(--forest)] transition hover:bg-[var(--cream)]"
              >
                Resend confirmation email
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--cream)] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
            New here?
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--forest)]">
            Create an account
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Check your email carefully. We block common domain typos before
            creating the account and ask you to enter the address twice.
          </p>

          <form action={signup} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={nextPath} />

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                Full name
              </span>
              <input
                required
                minLength={2}
                maxLength={100}
                type="text"
                name="fullName"
                autoComplete="name"
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-[var(--emerald)]"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                Email
              </span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-[var(--emerald)]"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                Confirm email
              </span>
              <input
                required
                type="email"
                name="confirmEmail"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-[var(--emerald)]"
              />
            </label>

            <PasswordField
              name="password"
              label="Password"
              autoComplete="new-password"
              minLength={8}
              helpText="Use at least 8 characters."
              backgroundClassName="bg-white"
            />

            <PasswordField
              name="confirmPassword"
              label="Confirm password"
              autoComplete="new-password"
              minLength={8}
              backgroundClassName="bg-white"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--gold)] px-5 py-3 font-bold text-[var(--ink)] transition hover:brightness-105"
            >
              Create account
            </button>
          </form>
        </section>
      </div>

      <p className="mt-8 text-sm text-[var(--muted)]">
        Just browsing?{" "}
        <Link
          href="/explore"
          className="font-semibold text-[var(--forest)] underline underline-offset-4"
        >
          Continue exploring homes
        </Link>
      </p>
    </div>
  );
}
