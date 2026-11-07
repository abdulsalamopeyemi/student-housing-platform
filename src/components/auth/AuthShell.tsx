import Link from "next/link";
import type { ReactNode } from "react";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  secondaryText: string;
  secondaryHref: string;
  secondaryLinkLabel: string;
}

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  secondaryText,
  secondaryHref,
  secondaryLinkLabel,
}: AuthShellProps) {
  return (
    <div className="auth-shell mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--auth-line)] bg-white shadow-[0_24px_80px_-40px_rgba(20,54,49,0.28)] lg:min-h-[690px] lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="auth-story relative isolate flex min-h-64 flex-col justify-between overflow-hidden bg-[var(--auth-pine)] px-7 py-7 text-white sm:px-10 sm:py-9 lg:min-h-full lg:px-12 lg:py-12">
        <div
          aria-hidden="true"
          className="auth-story-grid absolute inset-0 -z-10 opacity-60"
        />
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border border-white/20 bg-white/10 text-xs font-black tracking-wide text-[var(--auth-citrus)]">
            SH
          </span>
          <span className="text-sm font-bold tracking-wide">
            Student Housing
          </span>
        </div>

        <div className="relative mt-8 lg:mt-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--auth-citrus)]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-md font-serif text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/75 sm:text-base">
            {description}
          </p>

          <div
            aria-hidden="true"
            className="auth-route mt-7 hidden max-w-sm sm:block lg:mt-10"
          >
            <svg
              viewBox="0 0 360 148"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-auto w-full"
            >
              <path
                d="M22 116H82V74H145V108H216V47H276V78H338"
                stroke="white"
                strokeOpacity=".2"
                strokeWidth="1.5"
              />
              <path
                d="M28 115C72 115 61 74 105 74C149 74 135 108 181 108C227 108 202 47 247 47C292 47 287 78 332 78"
                stroke="#F1C96A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 7"
                className="auth-route-line"
              />
              <circle cx="28" cy="115" r="6" fill="#F1C96A" />
              <circle cx="105" cy="74" r="6" fill="#F1C96A" />
              <circle cx="181" cy="108" r="6" fill="#F1C96A" />
              <circle cx="247" cy="47" r="6" fill="#F1C96A" />
              <circle cx="332" cy="78" r="8" fill="#153B36" stroke="#F1C96A" strokeWidth="2" />
              <path
                d="M33 31h37M115 31h27M201 31h20M292 118h31"
                stroke="white"
                strokeOpacity=".14"
                strokeWidth="1"
              />
              <text x="18" y="139" fill="white" fillOpacity=".62" fontSize="9" letterSpacing="1.5">
                START WITH YOUR CAMPUS
              </text>
              <text x="274" y="62" fill="white" fillOpacity=".72" fontSize="9" letterSpacing="1">
                YOUR NEXT STEP
              </text>
            </svg>
          </div>
        </div>

        <p className="mt-8 text-xs text-white/50">
          Browse available homes before you decide.
        </p>
      </aside>

      <section className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div className="ui-enter mx-auto w-full max-w-md">
          {children}
          <p className="mt-8 border-t border-[var(--auth-line)] pt-5 text-sm text-[var(--auth-muted)]">
            {secondaryText}{" "}
            <Link
              href={secondaryHref}
              className="font-bold text-[var(--auth-pine)] underline decoration-[var(--auth-citrus)] decoration-2 underline-offset-4 transition hover:text-[var(--auth-green)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--auth-green)]"
            >
              {secondaryLinkLabel}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
