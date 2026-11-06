import { Suspense } from "react";

import SavedHomesCompareContent from "@/components/account/SavedHomesCompareContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export default function CompareSavedHomesPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
              <div className="h-12 max-w-2xl animate-pulse rounded-2xl bg-[var(--cream)]" />
              <div className="mt-8 h-80 animate-pulse rounded-3xl bg-white" />
            </div>
          }
        >
          <SavedHomesCompareContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
