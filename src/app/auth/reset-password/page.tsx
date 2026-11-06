import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { resetPassword } from "@/app/login/actions";
import PasswordField from "@/components/auth/PasswordField";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { getCurrentUser } from "@/lib/supabase/auth-server";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

async function ResetPasswordContent({
  searchParams,
}: ResetPasswordPageProps) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  if (!user) {
    redirect("/auth/forgot-password?error=Your+reset+session+has+expired.+Request+a+new+link.");
  }

  return (
    <section className="mx-auto max-w-xl px-5 py-16 lg:py-24">
      <div className="border-l-4 border-[var(--gold)] pl-5">
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
          Account access
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)]">
          Choose a new password.
        </h1>
        <p className="mt-4 leading-7 text-[var(--muted)]">
          Use at least 8 characters. You can sign in with the new password
          after saving it.
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

      <form
        action={resetPassword}
        className="mt-8 space-y-5 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8"
      >
        <PasswordField
          name="password"
          label="New password"
          autoComplete="new-password"
          minLength={8}
          helpText="Use at least 8 characters."
        />
        <PasswordField
          name="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          minLength={8}
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--forest)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--emerald)]"
        >
          Save new password
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

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[var(--paper)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-xl animate-pulse px-5 py-16">
              <div className="h-10 w-3/4 rounded-xl bg-[var(--cream)]" />
              <div className="mt-5 h-36 rounded-2xl bg-white" />
            </div>
          }
        >
          <ResetPasswordContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
