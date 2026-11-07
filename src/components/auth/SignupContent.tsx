import Link from "next/link";

import { signup } from "@/app/login/actions";
import ActionSubmitButton from "@/components/ui/ActionSubmitButton";
import AuthShell from "@/components/auth/AuthShell";
import PasswordField from "@/components/auth/PasswordField";
import { safeNextPath } from "@/lib/supabase/auth-shared";

interface SignupContentProps {
  searchParams: Promise<{
    accountType?: string;
    error?: string;
    next?: string;
  }>;
}

const accountTypes = [
  {
    value: "student",
    title: "Find a place",
    description: "Save homes and keep track of inspection requests.",
    icon: "⌂",
  },
  {
    value: "provider",
    title: "List a property",
    description: "Manage accommodation and reach student renters.",
    icon: "▤",
  },
];

export default async function SignupContent({
  searchParams,
}: SignupContentProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <AuthShell
        eyebrow="A place to begin"
        title="Make room for what comes next."
        description="Create an account to save the homes you like, follow inspection requests, or prepare a property listing."
        secondaryText="Already have an account?"
        secondaryHref={`/login?next=${encodeURIComponent(nextPath)}`}
        secondaryLinkLabel="Sign in"
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--auth-green)]">
          Create your account
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--auth-ink)] sm:text-4xl">
          Start with your plans.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--auth-muted)]">
          You can explore homes without an account. Sign up when you&apos;re
          ready to take the next step.
        </p>

        {params.error ? (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-800"
          >
            {params.error}
          </p>
        ) : null}

        <form action={signup} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-[var(--auth-ink)]">
              How will you use Student Housing?
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {accountTypes.map((accountType) => (
                <label
                  key={accountType.value}
                  className="group relative flex cursor-pointer gap-3 rounded-2xl border border-[var(--auth-line)] bg-white p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--auth-green)] has-[:checked]:border-[var(--auth-green)] has-[:checked]:bg-[#f0f6f1] has-[:checked]:ring-2 has-[:checked]:ring-[var(--auth-green)]/15 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--auth-green)]"
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={accountType.value}
                    defaultChecked={
                      (params.accountType === "provider"
                        ? "provider"
                        : "student") === accountType.value
                    }
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--auth-paper)] text-lg text-[var(--auth-green)]"
                  >
                    {accountType.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[var(--auth-ink)]">
                      {accountType.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[var(--auth-muted)]">
                      {accountType.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[var(--auth-ink)]">
              Full name
            </span>
            <input
              required
              minLength={2}
              maxLength={100}
              type="text"
              name="fullName"
              autoComplete="name"
              className="auth-input"
            />
          </label>

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

          <ActionSubmitButton
            pendingText="Creating your account…"
            className="auth-primary-button mt-2"
          >
            Create account
          </ActionSubmitButton>
        </form>

        <p className="mt-4 text-xs leading-5 text-[var(--auth-muted)]">
          Admin access is managed separately. Read our{" "}
          <Link
            href="/terms"
            className="font-semibold text-[var(--auth-pine)] underline underline-offset-4"
          >
            draft terms
          </Link>
          {" "}and{" "}
          <Link
            href="/privacy"
            className="font-semibold text-[var(--auth-pine)] underline underline-offset-4"
          >
            draft privacy notice
          </Link>
          .
        </p>
      </AuthShell>
    </div>
  );
}
