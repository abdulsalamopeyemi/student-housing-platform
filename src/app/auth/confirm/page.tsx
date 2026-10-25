"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ConfirmationState = "working" | "error";

export default function ConfirmEmailPage() {
  const [state, setState] = useState<ConfirmationState>("working");
  const [message, setMessage] = useState(
    "Confirming your email and preparing your account…",
  );

  useEffect(() => {
    async function confirmSession() {
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;

      const params = new URLSearchParams(hash);
      const errorDescription = params.get("error_description");

      if (errorDescription) {
        setState("error");
        setMessage(decodeURIComponent(errorDescription.replaceAll("+", " ")));
        return;
      }

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const expiresIn = Number(params.get("expires_in"));

      if (
        !accessToken ||
        !refreshToken ||
        !Number.isFinite(expiresIn) ||
        expiresIn <= 0
      ) {
        setState("error");
        setMessage(
          "The email may already be confirmed, but this link did not contain a usable session. Return to sign in with your email and password.",
        );
        return;
      }

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
          "Your email may be confirmed, but we could not create the browser session. Please sign in normally.",
        );
        return;
      }

      const requestedNext = new URLSearchParams(window.location.search).get("next");
      const nextPath =
        requestedNext &&
        requestedNext.startsWith("/") &&
        !requestedNext.startsWith("//")
          ? requestedNext
          : "/account";

      window.history.replaceState({}, "", "/auth/confirm");
      window.location.replace(nextPath);
    }

    void confirmSession();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-[var(--border)] bg-white p-7 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Email confirmation
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--forest)]">
          {state === "working" ? "Finishing your sign-up" : "Confirmation needs attention"}
        </h1>

        <p className="mt-4 leading-7 text-[var(--muted)]">{message}</p>

        {state === "error" ? (
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
          >
            Go to sign in
          </Link>
        ) : (
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-[var(--cream)]">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--gold)]" />
          </div>
        )}
      </div>
    </main>
  );
}
