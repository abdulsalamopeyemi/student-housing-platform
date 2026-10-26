"use client";

import { useActionState } from "react";

import {
  reportProperty,
  type ReportPropertyState,
} from "@/app/properties/report-actions";

const initialState: ReportPropertyState = {
  status: "idle",
  message: "",
};

interface ReportPropertyFormProps {
  propertyId: string;
  propertySlug: string;
}

export default function ReportPropertyForm({
  propertyId,
  propertySlug,
}: ReportPropertyFormProps) {
  const [state, formAction, isPending] = useActionState(
    reportProperty,
    initialState,
  );

  return (
    <details className="rounded-3xl border border-[var(--border)] bg-white p-6">
      <summary className="cursor-pointer list-none">
        <p className="text-sm font-bold uppercase tracking-wide text-red-700">
          Report listing
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Seen an incorrect price, fake photo, unavailable room or suspicious
          payment request? Send a private report to the platform team.
        </p>
      </summary>

      {state.status === "success" ? (
        <div
          role="status"
          className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
        >
          {state.message}
        </div>
      ) : (
        <form action={formAction} className="mt-5 space-y-4">
          <input type="hidden" name="propertyId" value={propertyId} />
          <input type="hidden" name="propertySlug" value={propertySlug} />

          {state.status === "error" ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            >
              {state.message}
            </div>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              What is wrong?
            </span>
            <select
              required
              name="reason"
              defaultValue=""
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--emerald)]"
            >
              <option value="" disabled>
                Choose a reason
              </option>
              <option value="wrong_price">Price or fees are incorrect</option>
              <option value="unavailable">Property/rooms are not actually available</option>
              <option value="misleading_photos">Photos are misleading or not this property</option>
              <option value="suspicious_payment">Suspicious payment request</option>
              <option value="wrong_location">Location information is incorrect</option>
              <option value="other">Something else</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              More details (optional)
            </span>
            <textarea
              name="details"
              maxLength={1200}
              rows={4}
              placeholder="Briefly explain what you noticed."
              className="w-full resize-y rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--emerald)]"
            />
          </label>

          <button
            disabled={isPending}
            className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Submitting…" : "Submit private report"}
          </button>

          <p className="text-xs leading-5 text-[var(--muted)]">
            Your report is not shown to other students or on the public listing.
          </p>
        </form>
      )}
    </details>
  );
}
