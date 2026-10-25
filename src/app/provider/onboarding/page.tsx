import { Suspense } from "react";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import ProviderOnboardingContent from "@/components/provider/ProviderOnboardingContent";

interface ProviderOnboardingPageProps {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
}

export default function ProviderOnboardingPage({
  searchParams,
}: ProviderOnboardingPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
              <div className="h-12 max-w-xl animate-pulse rounded-2xl bg-[var(--cream)]" />
            </div>
          }
        >
          <ProviderOnboardingContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
