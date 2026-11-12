"use client";

import { useEffect } from "react";

const AUTH_HASH_KEYS = [
  "access_token",
  "error",
  "error_code",
  "error_description",
];

/**
 * Supabase falls back to the project's Site URL when a confirmation or recovery
 * redirect is not allow-listed. When that Site URL is the app root, the tokens
 * arrive on any page as a URL hash. Forward those hashes to the page that knows
 * how to finish the flow instead of silently leaving the visitor signed out.
 */
export default function AuthHashHandler() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);

    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);

    if (!AUTH_HASH_KEYS.some((key) => params.has(key))) {
      return;
    }

    const targetPath =
      params.get("type") === "recovery" ? "/auth/recover" : "/auth/confirm";
    const currentUrl = new URL(window.location.href);

    if (currentUrl.pathname === targetPath) {
      return;
    }

    window.location.replace(`${targetPath}${currentUrl.search}#${hash}`);
  }, []);

  return null;
}
