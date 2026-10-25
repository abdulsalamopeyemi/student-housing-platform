"use client";

import { useState } from "react";

interface SavePropertyButtonProps {
  propertyName: string;
}

export default function SavePropertyButton({
  propertyName,
}: SavePropertyButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  function handleSave() {
    setIsSaved((currentValue) => !currentValue);
  }

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={
        isSaved
          ? `Remove ${propertyName} from saved homes`
          : `Save ${propertyName}`
      }
      onClick={handleSave}
      className={[
        "rounded-xl border px-4 py-2 text-sm font-semibold transition",
        isSaved
          ? "border-[var(--forest)] bg-[var(--forest)] text-white"
          : "border-[var(--border)] bg-white text-[var(--forest)] hover:border-[var(--forest)]",
      ].join(" ")}
    >
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
