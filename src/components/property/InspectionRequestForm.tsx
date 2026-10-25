"use client";

import { FormEvent, useState } from "react";

interface InspectionRequestFormProps {
  propertyName: string;
}

type SubmissionState = "idle" | "submitting" | "success";

export default function InspectionRequestForm({
  propertyName,
}: InspectionRequestFormProps) {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("submitting");

    window.setTimeout(() => {
      setSubmissionState("success");
    }, 500);
  }

  if (submissionState === "success") {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Request captured in the prototype
        </p>
        <h2 className="mt-3 text-2xl font-bold text-[var(--forest)]">
          Your interest in {propertyName} is ready for the real submission flow.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          This interface is working, but the request is not persisted yet.
          Database storage, provider notification, and request status tracking
          come in the backend milestone.
        </p>

        <button
          type="button"
          onClick={() => setSubmissionState("idle")}
          className="mt-6 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--forest)]"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--border)] bg-white p-6"
    >
      <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
        Request an inspection
      </p>

      <h2 className="mt-3 text-2xl font-bold text-[var(--forest)]">
        Interested in {propertyName}?
      </h2>

      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        Share your contact details and preferred inspection date. We will wire
        this form to real persistence and provider notifications in the backend
        milestone.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Full name
          </span>
          <input
            required
            name="fullName"
            type="text"
            autoComplete="name"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Phone number
          </span>
          <input
            required
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Email
          </span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Preferred date
          </span>
          <input
            required
            name="preferredDate"
            type="date"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
          Note (optional)
        </span>
        <textarea
          name="note"
          rows={4}
          placeholder="Anything you want the provider to know?"
          className="w-full resize-y rounded-xl border border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
        />
      </label>

      <button
        type="submit"
        disabled={submissionState === "submitting"}
        className="mt-6 w-full rounded-xl bg-[var(--forest)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--emerald)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submissionState === "submitting"
          ? "Sending request…"
          : "Request inspection"}
      </button>
    </form>
  );
}
