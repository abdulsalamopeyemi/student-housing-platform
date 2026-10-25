import { Suspense } from "react";

import LoginContent from "@/components/auth/LoginContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
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
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
