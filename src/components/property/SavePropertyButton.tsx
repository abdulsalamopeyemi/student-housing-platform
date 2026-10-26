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
}

export default function SavePropertyButton({
  propertyId,
  propertySlug,
  propertyName,
  initiallySaved,
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
            state.saved
              ? "border-white/30 bg-white text-[var(--forest)]"
              : "border-white/30 bg-white/10 text-white hover:bg-white/20",
          ].join(" ")}
        >
          {isPending
            ? "Saving…"
            : state.saved
              ? "Saved"
              : "Save property"}
        </button>
      </form>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={[
            "mt-2 text-xs leading-5",
            state.status === "error" ? "text-red-200" : "text-white/70",
          ].join(" ")}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
