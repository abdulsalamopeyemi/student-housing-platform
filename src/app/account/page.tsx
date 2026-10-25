import { Suspense } from "react";

import StudentAccountContent from "@/components/account/StudentAccountContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
              <div className="h-48 animate-pulse rounded-3xl bg-[var(--cream)]" />
            </div>
          }
        >
          <StudentAccountContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
