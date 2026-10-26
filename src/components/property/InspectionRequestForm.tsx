"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  requestInspection,
  type InspectionActionState,
} from "@/app/properties/inspection-actions";

const initialInspectionActionState: InspectionActionState = {
  status: "idle",
  message: "",
};

interface InspectionRequestFormProps {
  propertyId: string;
  propertySlug: string;
  propertyName: string;
}

function localDateString() {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function InspectionRequestForm({
  propertyId,
  propertySlug,
  propertyName,
}: InspectionRequestFormProps) {
  const [state, formAction, isPending] = useActionState(
    requestInspection,
    initialInspectionActionState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Inspection requested
        </p>
        <h2 className="mt-3 text-2xl font-bold text-[var(--forest)]">
          Your request for {propertyName} has been sent.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          The provider can now see this request in their workspace. You can
          track whether it is requested, confirmed, declined, or completed from
          your student account.
        </p>

        <Link
          href="/account"
          className="mt-6 inline-flex rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white"
        >
          View My Account
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-[var(--border)] bg-white p-6"
    >
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="propertySlug" value={propertySlug} />

      <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
        Request an inspection
      </p>

      <h2 className="mt-3 text-2xl font-bold text-[var(--forest)]">
        Interested in {propertyName}?
      </h2>

      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        Choose a preferred date and provide the phone number the provider should
        use to coordinate the inspection. You will be asked to sign in if you
        are not already using a student account.
      </p>

      {state.status === "error" ? (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        <label>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Phone number
          </span>
          <input
            required
            minLength={7}
            maxLength={30}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 08012345678"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Preferred date
          </span>
          <input
            required
            min={localDateString()}
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
          maxLength={1000}
          placeholder="Anything the provider should know before the inspection?"
          className="w-full resize-y rounded-xl border border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-xl bg-[var(--forest)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--emerald)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending request…" : "Request inspection"}
      </button>

      <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
        Requesting an inspection does not reserve the room or authorize any
        payment.
      </p>
    </form>
  );
}
