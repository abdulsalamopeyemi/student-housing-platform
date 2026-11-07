"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

interface ActionSubmitButtonProps {
  children: ReactNode;
  pendingText: string;
  className: string;
  disabled?: boolean;
}

export default function ActionSubmitButton({
  children,
  pendingText,
  className,
  disabled = false,
}: ActionSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending || undefined}
      className={`${className} disabled:cursor-wait disabled:opacity-70`}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2" role="status">
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
          />
          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
