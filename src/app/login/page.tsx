import { Suspense } from "react";

import AuthLoadingSkeleton from "@/components/auth/AuthLoadingSkeleton";
import SigninContent from "@/components/auth/SigninContent";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
}

export const metadata = {
  title: "Sign in",
  description:
    "Sign in to your Student Housing account to manage saved homes, inspection requests, or property listings.",
};

export default function LoginPage({ searchParams }: LoginPageProps) {
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
          <SigninContent searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
