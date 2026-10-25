import { Suspense } from "react";

import PropertyDetailsContent from "@/components/property/PropertyDetailsContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface PropertyDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function PropertyDetailsFallback() {
  return (
    <section className="bg-[var(--cream)] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="h-4 w-28 animate-pulse rounded bg-[var(--border)]" />
        <div className="mt-6 h-10 max-w-md animate-pulse rounded-xl bg-white/70" />
        <div className="mt-4 h-5 max-w-2xl animate-pulse rounded bg-white/70" />
        <div className="mt-8 h-44 animate-pulse rounded-3xl border border-[var(--border)] bg-white" />
      </div>
    </section>
  );
}

export default function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  return (
    <>
      <SiteHeader />

      <main>
        <Suspense fallback={<PropertyDetailsFallback />}>
          <PropertyDetailsContent params={params} />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}
