"use client";

import { useActionState } from "react";

import {
  toggleSavedProperty,
  type SavePropertyState,
} from "@/app/properties/save-actions";

interface SavePropertyButtonProps {
  propertyId: string;
  propertySlug: string;
  propertyName: string;
  initiallySaved: boolean;
  variant?: "dark" | "light";
}

export default function SavePropertyButton({
  propertyId,
  propertySlug,
  propertyName,
  initiallySaved,
  variant = "dark",
}: SavePropertyButtonProps) {
  const initialState: SavePropertyState = {
    saved: initiallySaved,
    message: "",
    status: "idle",
  };

  const [state, formAction, isPending] = useActionState(
    toggleSavedProperty,
    initialState,
  );

  const buttonStyle = state.saved
    ? variant === "light"
      ? "border-red-200 bg-white text-red-700 hover:bg-red-50"
      : "border-white/30 bg-white text-[var(--forest)]"
    : variant === "light"
      ? "border-[var(--border)] bg-white text-[var(--forest)] hover:bg-[var(--cream)]"
      : "border-white/30 bg-white/10 text-white hover:bg-white/20";

  const messageStyle =
    state.status === "error"
      ? variant === "light"
        ? "text-red-700"
        : "text-red-200"
      : variant === "light"
        ? "text-[var(--muted)]"
        : "text-white/70";

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="propertyId" value={propertyId} />
        <input type="hidden" name="propertySlug" value={propertySlug} />

        <button
          type="submit"
          disabled={isPending}
          aria-pressed={state.saved}
          aria-label={
            state.saved
              ? `Remove ${propertyName} from saved homes`
              : `Save ${propertyName}`
          }
          className={[
            "rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
            buttonStyle,
          ].join(" ")}
        >
          {isPending
            ? state.saved
              ? "Removing…"
              : "Saving…"
            : state.saved
              ? variant === "light"
                ? "Remove saved"
                : "Saved"
              : "Save property"}
        </button>
      </form>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={["mt-2 text-xs leading-5", messageStyle].join(" ")}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
