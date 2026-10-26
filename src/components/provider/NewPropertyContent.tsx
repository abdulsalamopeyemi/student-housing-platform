import Link from "next/link";
import { redirect } from "next/navigation";

import PropertyDraftForm from "@/components/provider/PropertyDraftForm";
import { getAmenities } from "@/lib/data/amenities";
import { getCurrentProvider } from "@/lib/data/providers";
import { getUniversities } from "@/lib/data/universities";

interface NewPropertyContentProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function NewPropertyContent({
  searchParams,
}: NewPropertyContentProps) {
  const [{ user, provider }, universities, amenities, params] =
    await Promise.all([
      getCurrentProvider(),
      getUniversities(),
      getAmenities(),
      searchParams,
    ]);

  if (!user) {
    redirect("/login?next=/provider/properties/new");
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  if (provider.provider_type === "agent") {
    redirect(
      "/list-property?message=Agents+manage+properties+assigned+by+owners+and+cannot+create+owner+listings.",
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <Link
        href="/list-property"
        className="text-sm font-semibold text-[var(--emerald)]"
      >
        ← Back to provider workspace
      </Link>

      <div className="mt-6 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          New property
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
          Create a real property draft.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          This information is stored in the live database and tied to your
          provider account. Saving a draft does not make the property public.
        </p>
      </div>

      {params.error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {params.error}
        </div>
      ) : null}

      <div className="mt-8">
        <PropertyDraftForm
          universities={universities}
          amenities={amenities}
        />
      </div>
    </div>
  );
}
