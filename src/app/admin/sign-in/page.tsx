import { Suspense } from "react";

import AdminSignInContent from "@/components/admin/AdminSignInContent";

interface AdminSignInPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
}

export const metadata = {
  title: "Admin sign in",
  description: "Sign in to the Student Housing admin workspace.",
};

export default function AdminSignInPage({
  searchParams,
}: AdminSignInPageProps) {
  return (
    <Suspense
      fallback={
        <main
          role="status"
          aria-busy="true"
          aria-label="Loading admin sign in"
          className="grid min-h-screen place-items-center bg-[var(--paper)] px-4 py-10 sm:px-6"
        >
          <div className="ui-skeleton h-[560px] w-full max-w-5xl rounded-[2rem]" />
        </main>
      }
    >
      <AdminSignInContent searchParams={searchParams} />
    </Suspense>
  );
}
