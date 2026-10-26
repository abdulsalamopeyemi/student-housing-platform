const fallbackSupabaseUrl = "https://vucekwajkvrlcxzpqolc.supabase.co";
const fallbackPublishableKey = "sb_publishable_wRnzMotB-oPSu7P-Fm5iJQ_EX4G3L_g";

// Ignore unset or placeholder values (e.g. "YOUR_SUPABASE_PUBLISHABLE_KEY")
// so a misconfigured environment falls back to the public project config.
function readPublishableKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (key && (key.startsWith("sb_publishable_") || key.startsWith("eyJ"))) {
    return key;
  }

  return fallbackPublishableKey;
}

function readSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  return url && url.startsWith("https://") ? url : fallbackSupabaseUrl;
}

export const supabasePublicConfig = {
  url: readSupabaseUrl(),
  publishableKey: readPublishableKey(),
} as const;
