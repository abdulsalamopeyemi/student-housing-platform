import Link from "next/link";
import { redirect } from "next/navigation";

import PropertyDraftForm from "@/components/provider/PropertyDraftForm";
import { getAmenities } from "@/lib/data/amenities";
import { getCurrentProvider } from "@/lib/data/providers";
import { getUniversities } from "@/lib/data/universities";

export default async function StartPropertyListingContent() {
  const { user, provider } = await getCurrentProvider();

  if (!user) {
    redirect("/login?next=/list-property/start");
  }

  if (!provider) {
    redirect("/provider/onboarding?next=/list-property/start");
  }

  if (provider.provider_type === "agent") {
    redirect(
      "/list-property?message=Agents+manage+properties+assigned+by+owners+and+cannot+create+owner+listings.",
    );
  }

  const [universities, amenities] = await Promise.all([
    getUniversities(),
    getAmenities(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <Link
        href="/list-property"
        className="text-sm font-semibold text-[var(--emerald)]"
      >
        ← Back to listing overview
      </Link>

      <div className="mt-6 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Start a property listing
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
          Add the details students need before they decide.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          You are signed in as a property provider. Saving creates a private
          draft in your workspace.
        </p>
      </div>

      <div className="mt-8">
        <PropertyDraftForm
          universities={universities}
          amenities={amenities}
        />
      </div>
    </div>
  );
}
