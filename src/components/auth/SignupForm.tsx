"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { signup } from "@/app/login/actions";
import AccountRoleIcon from "@/components/layout/AccountRoleIcon";
import ActionSubmitButton from "@/components/ui/ActionSubmitButton";
import PasswordField from "@/components/auth/PasswordField";
import type { AccountType } from "@/lib/supabase/auth-shared";

interface SignupFormProps {
  initialAccountType: AccountType | null;
  nextPath: string;
  error?: string;
  startAtDetails: boolean;
}

const accountTypes: {
  value: AccountType;
  title: string;
  description: string;
  detail: string;
}[] = [
  {
    value: "student",
    title: "Tenant",
    description: "Find a student home that fits your next chapter.",
    detail: "Save homes · request inspections · track your search",
  },
  {
    value: "provider",
    title: "Landlord",
    description: "Share your accommodation with students looking nearby.",
    detail: "List properties · manage rooms · review enquiries",
  },
];

export default function SignupForm({
  initialAccountType,
  nextPath,
  error,
  startAtDetails,
}: SignupFormProps) {
  const [accountType, setAccountType] = useState<AccountType | null>(
    initialAccountType,
  );
  const [step, setStep] = useState<"role" | "details">(
    startAtDetails && initialAccountType ? "details" : "role",
  );
  const roleHeadingRef = useRef<HTMLHeadingElement>(null);
  const detailsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step === "role") {
      roleHeadingRef.current?.focus();
    } else {
      detailsHeadingRef.current?.focus();
    }
  }, [step]);

  const selectedAccount = accountTypes.find(
    (option) => option.value === accountType,
  );

  return (
    <div aria-live="polite">
      <section
        hidden={step !== "role"}
        aria-labelledby="signup-role-heading"
      >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--auth-green)]">
            Account setup · Step 1 of 2
          </p>
          <h2
            id="signup-role-heading"
            ref={roleHeadingRef}
            tabIndex={-1}
            className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--auth-ink)] sm:text-4xl"
          >
            Who are you here as?
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--auth-muted)]">
            Choose your role first. It sets up the right account and takes you
            to the right place after sign-in.
          </p>

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-800"
            >
              {error}
            </p>
          ) : null}

          <fieldset className="mt-6">
            <legend className="sr-only">Choose Tenant or Landlord</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {accountTypes.map((option) => {
                const isSelected = accountType === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setAccountType(option.value)}
                    className={`group relative flex min-h-56 flex-col items-start rounded-2xl border p-5 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--auth-green)] sm:min-h-64 sm:p-6 ${
                      isSelected
                        ? "border-[var(--auth-green)] bg-[var(--auth-paper)] ring-2 ring-[var(--auth-green)]/20"
                        : "border-[var(--auth-line)] bg-white hover:-translate-y-0.5 hover:border-[var(--auth-green)]/60 hover:shadow-lg hover:shadow-[var(--auth-pine)]/5"
                    }`}
                  >
                    <span
                      className={`grid size-12 place-items-center rounded-2xl transition ${
                        isSelected
                          ? "bg-[var(--auth-pine)] text-[var(--auth-citrus)]"
                          : "bg-[var(--auth-paper)] text-[var(--auth-green)] group-hover:bg-white"
                      }`}
                    >
                      <AccountRoleIcon
                        role={option.value}
                        className="size-7"
                      />
                    </span>
                    <span className="mt-5 block text-xl font-bold tracking-tight text-[var(--auth-ink)]">
                      {option.title}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-[var(--auth-muted)]">
                      {option.description}
                    </span>
                    <span className="mt-auto pt-5 text-[11px] font-semibold leading-5 text-[var(--auth-green)]">
                      {option.detail}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`absolute right-5 top-5 grid size-5 place-items-center rounded-full border ${
                        isSelected
                          ? "border-[var(--auth-green)] bg-[var(--auth-green)] text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected ? (
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          className="size-3"
                        >
                          <path
                            d="m3.5 8 3 3 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <button
            type="button"
            disabled={!accountType}
            onClick={() => setStep("details")}
            className="auth-primary-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-45"
          >
            Continue with {selectedAccount?.title ?? "your role"}
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </button>
      </section>
      <section
        hidden={step !== "details"}
        aria-labelledby="signup-details-heading"
      >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--auth-green)]">
            Account setup · Step 2 of 2
          </p>
          <h2
            id="signup-details-heading"
            ref={detailsHeadingRef}
            tabIndex={-1}
            className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--auth-ink)] sm:text-4xl"
          >
            Create your account.
          </h2>
          <button
            type="button"
            onClick={() => setStep("role")}
            className="mt-4 flex w-full items-center gap-3 rounded-xl border border-[var(--auth-line)] bg-[var(--auth-paper)] p-3 text-left transition hover:border-[var(--auth-green)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--auth-green)]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[var(--auth-green)]">
              {accountType ? (
                <AccountRoleIcon role={accountType} className="size-6" />
              ) : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold uppercase tracking-wide text-[var(--auth-muted)]">
                Account type
              </span>
              <span className="mt-0.5 block font-bold text-[var(--auth-ink)]">
                {selectedAccount?.title}
              </span>
            </span>
            <span className="text-sm font-bold text-[var(--auth-green)]">
              Change
            </span>
          </button>

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-800"
            >
              {error}
            </p>
          ) : null}

          <form action={signup} className="mt-5 space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <input
              type="hidden"
              name="accountType"
              value={accountType ?? ""}
            />

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
                className="auth-input"
              />
            </label>

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
              Create {selectedAccount?.title.toLowerCase()} account
            </ActionSubmitButton>
          </form>

          <p className="mt-4 text-xs leading-5 text-[var(--auth-muted)]">
            Admin access is managed separately. Read our{" "}
            <Link
              href="/terms"
              className="font-semibold text-[var(--auth-pine)] underline underline-offset-4"
            >
              draft terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-[var(--auth-pine)] underline underline-offset-4"
            >
              draft privacy notice
            </Link>
            .
          </p>
      </section>
    </div>
  );
}
