import { Suspense } from "react";

import ListPropertyContent from "@/components/provider/ListPropertyContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface ListPropertyPageProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

export default function ListPropertyPage({
  searchParams,
}: ListPropertyPageProps) {
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
          <ListPropertyContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
