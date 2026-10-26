import { NextResponse } from "next/server";

import { adoptAuthTokens } from "@/lib/supabase/auth-server";

interface SessionRequestBody {
  accessToken?: unknown;
  refreshToken?: unknown;
  expiresIn?: unknown;
}

export async function POST(request: Request) {
  let payload: SessionRequestBody;

  try {
    payload = (await request.json()) as SessionRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid confirmation payload." },
      { status: 400 },
    );
  }

  const { accessToken, refreshToken, expiresIn } = payload;

  if (
    typeof accessToken !== "string" ||
    typeof refreshToken !== "string" ||
    typeof expiresIn !== "number" ||
    !Number.isFinite(expiresIn) ||
    expiresIn <= 0 ||
    expiresIn > 60 * 60 * 24 * 7
  ) {
    return NextResponse.json(
      { error: "Invalid confirmation session." },
      { status: 400 },
    );
  }

  const { error } = await adoptAuthTokens(
    accessToken,
    refreshToken,
    Math.floor(expiresIn),
  );

  if (error) {
    return NextResponse.json({ error }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
