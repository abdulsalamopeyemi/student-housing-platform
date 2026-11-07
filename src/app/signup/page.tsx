import { Suspense } from "react";

import AuthLoadingSkeleton from "@/components/auth/AuthLoadingSkeleton";
import SignupContent from "@/components/auth/SignupContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface SignupPageProps {
  searchParams: Promise<{
    accountType?: string;
    error?: string;
    next?: string;
  }>;
}

export const metadata = {
  title: "Create an account",
  description:
    "Choose Tenant or Landlord, then create the Student Housing account and workspace that fit.",
};

export default function SignupPage({ searchParams }: SignupPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="auth-page flex-1">
        <Suspense
          fallback={
            <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
              <AuthLoadingSkeleton />
            </div>
          }
        >
          <SignupContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
