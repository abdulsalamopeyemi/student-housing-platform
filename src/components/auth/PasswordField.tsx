"use client";

import { useId, useState } from "react";

interface PasswordFieldProps {
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  helpText?: string;
  backgroundClassName?: string;
}

export default function PasswordField({
  name,
  label,
  autoComplete,
  minLength,
  helpText,
  backgroundClassName = "",
}: PasswordFieldProps) {
  const inputId = useId();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </span>

      <span className="relative block">
        <input
          id={inputId}
          required
          minLength={minLength}
          type={isVisible ? "text" : "password"}
          name={name}
          autoComplete={autoComplete}
          className={`auth-input pr-20 ${backgroundClassName}`}
        />

        <button
          type="button"
          aria-pressed={isVisible}
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setIsVisible((visible) => !visible)}
          className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-4 text-sm font-semibold text-[var(--forest)] transition hover:text-[var(--emerald)] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--emerald)]"
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </span>

      {helpText ? (
        <span className="mt-1.5 block text-xs text-[var(--muted)]">
          {helpText}
        </span>
      ) : null}
    </label>
  );
}
