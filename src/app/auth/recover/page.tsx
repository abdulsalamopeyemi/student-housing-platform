"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type RecoveryState = "working" | "error";

export default function RecoverPasswordPage() {
  const [state, setState] = useState<RecoveryState>("working");
  const [message, setMessage] = useState(
    "Checking your secure link before opening password reset.",
  );

  useEffect(() => {
    async function adoptRecoverySession() {
      const currentUrl = new URL(window.location.href);
      const params = new URLSearchParams(currentUrl.hash.slice(1));
      const errorDescription = params.get("error_description");
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const expiresIn = Number(params.get("expires_in"));
      const type = params.get("type");

      window.history.replaceState(
        {},
        "",
        `${currentUrl.pathname}${currentUrl.search}`,
      );

      if (errorDescription) {
        setState("error");
        setMessage(
          "This reset link has expired or was already used. Request a new one to continue.",
        );
        return;
      }

      if (
        type !== "recovery" ||
        !accessToken ||
        !refreshToken ||
        !Number.isFinite(expiresIn) ||
        expiresIn <= 0
      ) {
        setState("error");
        setMessage(
          "This reset link is incomplete or expired. Request a new password reset link and try again.",
        );
        return;
      }

      try {
        const response = await fetch("/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken,
            refreshToken,
            expiresIn,
          }),
        });

        if (!response.ok) {
          setState("error");
          setMessage(
            "This reset link could not be verified. Request a new one and try again.",
          );
          return;
        }

        window.location.replace("/auth/reset-password");
      } catch {
        setState("error");
        setMessage(
          "We could not verify the reset link. Check your connection and try again.",
        );
      }
    }

    void adoptRecoverySession();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-5 py-16">
      <section className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-white p-7 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Account access
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--forest)]">
          {state === "working"
            ? "Opening your secure reset link"
            : "This reset link needs attention"}
        </h1>
        <p
          role={state === "error" ? "alert" : "status"}
          className="mt-4 leading-7 text-[var(--muted)]"
        >
          {message}
        </p>

        {state === "error" ? (
          <Link
            href="/auth/forgot-password"
            className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--emerald)]"
          >
            Request another link
          </Link>
        ) : (
          <div
            aria-hidden="true"
            className="mt-7 h-1 overflow-hidden rounded-full bg-[var(--cream)]"
          >
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--gold)] motion-reduce:animate-none" />
          </div>
        )}
      </section>
    </main>
  );
}
