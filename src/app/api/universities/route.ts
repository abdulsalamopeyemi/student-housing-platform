import { NextResponse } from "next/server";

import { getUniversities } from "@/lib/data/universities";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const limitParam = Number(searchParams.get("limit") ?? "20");
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.floor(limitParam), 1), 100)
    : 20;

  const universities = await getUniversities();

  const results = universities
    .filter((university) => {
      if (!query) {
        return true;
      }

      return (
        university.name.toLowerCase().includes(query) ||
        university.state.toLowerCase().includes(query) ||
        university.city.toLowerCase().includes(query)
      );
    })
    .slice(0, limit)
    .map((university) => ({
      id: university.id,
      name: university.name,
      slug: university.slug,
      city: university.city,
      state: university.state,
      ownership: university.ownership,
      yearEstablished: university.year_established,
    }));

  return NextResponse.json({
    total: universities.length,
    count: results.length,
    results,
  });
}
