import { Suspense } from "react";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import ProviderWorkspaceContent from "@/components/provider/ProviderWorkspaceContent";

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
          <ProviderWorkspaceContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
