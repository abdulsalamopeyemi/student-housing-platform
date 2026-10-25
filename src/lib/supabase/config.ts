export const supabasePublicConfig = {
  url:
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://vucekwajkvrlcxzpqolc.supabase.co",
  publishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "sb_publishable_wRnzMotB-oPSu7P-Fm5iJQ_EX4G3L_g",
} as const;
