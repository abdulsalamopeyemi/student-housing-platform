import { Suspense } from "react";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import PaymentVerifyContent from "@/components/payments/PaymentVerifyContent";

interface PaymentVerifyPageProps {
  searchParams: Promise<{
    reference?: string;
  }>;
}

export default function PaymentVerifyPage({
  searchParams,
}: PaymentVerifyPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-3xl bg-white" />
            }
          >
            <PaymentVerifyContent searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
