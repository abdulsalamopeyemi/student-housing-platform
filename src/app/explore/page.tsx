import { Suspense } from "react";

import ExploreContent from "@/components/explore/ExploreContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface ExplorePageProps {
  searchParams: Promise<{
    location?: string;
    budget?: string;
    roomType?: string;
  }>;
}

function ExploreFallback() {
  return (
    <section className="bg-[var(--cream)] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="h-4 w-40 animate-pulse rounded bg-[var(--border)]" />
        <div className="mt-4 h-12 max-w-2xl animate-pulse rounded-2xl bg-white/70" />
        <div className="mt-4 h-6 max-w-xl animate-pulse rounded bg-white/70" />
        <div className="mt-8 h-28 animate-pulse rounded-3xl border border-[var(--border)] bg-white" />
      </div>
    </section>
  );
}

export default function ExplorePage({ searchParams }: ExplorePageProps) {
  return (
    <>
      <SiteHeader />

      <main>
        <Suspense fallback={<ExploreFallback />}>
          <ExploreContent searchParams={searchParams} />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}
