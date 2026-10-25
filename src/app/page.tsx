import { Suspense } from "react";

import FeaturedProperties from "@/components/home/FeaturedProperties";
import HeroV2 from "@/components/home/HeroV2";
import HowItWorks from "@/components/home/HowItWorks";
import ProviderCTA from "@/components/home/ProviderCTA";
import TrustAndSafety from "@/components/home/TrustAndSafety";
import TrustStrip from "@/components/home/TrustStrip";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

function FeaturedPropertiesFallback() {
  return (
    <section className="bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="h-4 w-44 animate-pulse rounded bg-[var(--border)]" />
        <div className="mt-4 h-10 max-w-2xl animate-pulse rounded-2xl bg-[var(--cream)]" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-96 animate-pulse rounded-3xl border border-[var(--border)] bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <HeroV2 />
        <TrustStrip />
        <Suspense fallback={<FeaturedPropertiesFallback />}>
          <FeaturedProperties />
        </Suspense>
        <HowItWorks />
        <TrustAndSafety />
        <ProviderCTA />
      </main>

      <SiteFooter />
    </>
  );
}
