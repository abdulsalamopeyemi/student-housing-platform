import Link from "next/link";

import { resendConfirmation } from "@/app/login/actions";
import { safeNextPath } from "@/lib/supabase/auth-shared";

interface CheckEmailContentProps {
  searchParams: Promise<{
    email?: string;
    next?: string;
    error?: string;
    message?: string;
    setup?: string;
  }>;
}

export default async function CheckEmailContent({
  searchParams,
}: CheckEmailContentProps) {
  const params = await searchParams;
  const email = (params.email ?? "").trim().slice(0, 254);
  const nextPath = safeNextPath(params.next);
  const setupRequired = params.setup === "required";

  return (
    <section className="mx-auto w-full max-w-xl rounded-3xl border border-[var(--border)] bg-white p-7 shadow-sm sm:p-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--cream)] text-2xl text-[var(--forest)]">
        ✉
      </div>

      <p className="mt-7 text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
        Account verification
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--forest)] sm:text-4xl">
        Verify your email
      </h1>
      <p className="mt-4 leading-7 text-[var(--muted)]">
        {setupRequired
          ? "Your account was created, but email verification is not configured for this application."
          : "We sent a verification link to this email address:"}
      </p>

      {email ? (
        <p className="mt-2 break-all rounded-xl bg-[var(--cream)] px-4 py-3 font-semibold text-[var(--forest)]">
          {email}
        </p>
      ) : null}

      <p className="mt-4 leading-7 text-[var(--muted)]">
        {setupRequired
          ? "The site administrator must enable email confirmations in the Supabase project before you can sign in. Contact support once this is configured."
          : (
              <>
                Open the message and select{" "}
                <strong>Confirm email address</strong>. We&apos;ll verify your
                address and take you to the next step in your Student Housing
                account. Delivery can take a few minutes.
              </>
            )}
      </p>

      {!setupRequired ? (
        <div className="mt-6 rounded-2xl border border-[var(--border)] p-4">
          <p className="font-semibold text-[var(--forest)]">
            Don&apos;t see the message?
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted)]">
            <li>Check your Spam, Promotions or Updates folder.</li>
            <li>Make sure the email address is correct.</li>
            <li>
              Wait a few minutes before requesting another message. Repeated
              requests may be rate-limited.
            </li>
          </ul>
        </div>
      ) : null}

      {params.error ? (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {params.error}
        </p>
      ) : null}

      {params.message ? (
        <p
          role="status"
          className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          {params.message}
        </p>
      ) : null}

      {email && !setupRequired ? (
        <form action={resendConfirmation} className="mt-6">
          <input type="hidden" name="resendEmail" value={email} />
          <input type="hidden" name="next" value={nextPath} />
          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--forest)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--emerald)]"
          >
            Resend confirmation email
          </button>
        </form>
      ) : null}

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        {setupRequired
          ? "Once verification is configured, "
          : "Already verified? "}
        <Link
          href={`/login?next=${encodeURIComponent(nextPath)}`}
          className="font-semibold text-[var(--forest)] underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
