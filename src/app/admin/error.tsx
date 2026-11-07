"use client";

import { useEffect } from "react";

interface AdminErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function AdminError({ error, retry }: AdminErrorProps) {
  useEffect(() => {
    console.error("Admin workspace failed to render.", {
      digest: error.digest,
    });
  }, [error.digest]);

  return (
    <main className="grid min-h-[70vh] place-items-center bg-[var(--paper)] px-5 py-12">
      <section
        role="alert"
        className="w-full max-w-2xl rounded-3xl border border-red-200 bg-white p-7 shadow-sm sm:p-9"
      >
        <p className="text-sm font-bold uppercase tracking-wide text-red-700">
          Admin workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--forest)]">
          The dashboard could not load.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Check that the server-side Supabase secret key is configured for the
          same project and that the deployment has been rebuilt. If it is
          already configured, check the hosting runtime logs for the
          corresponding server error.
        </p>
        {error.digest ? (
          <p className="mt-4 text-xs text-[var(--muted)]">
            Error reference: <code>{error.digest}</code>
          </p>
        ) : null}
        <button
          type="button"
          onClick={retry}
          className="mt-6 rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--emerald)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emerald)]"
        >
          Retry loading dashboard
        </button>
      </section>
    </main>
  );
}
