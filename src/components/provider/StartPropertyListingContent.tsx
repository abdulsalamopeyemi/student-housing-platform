import Link from "next/link";
import { redirect } from "next/navigation";

import PropertyDraftForm from "@/components/provider/PropertyDraftForm";
import { getAmenities } from "@/lib/data/amenities";
import { getCurrentProvider } from "@/lib/data/providers";
import { getUniversities } from "@/lib/data/universities";

export default async function StartPropertyListingContent() {
  const [{ user, provider }, universities, amenities] = await Promise.all([
    getCurrentProvider(),
    getUniversities(),
    getAmenities(),
  ]);

  if (user && !provider) {
    redirect("/provider/onboarding?next=/list-property/start");
  }

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
          {provider
            ? "You are signed in as a property provider. Saving creates a private draft in your workspace."
            : "You can begin without an account. Your entries stay in this browser until you sign in and create a provider profile."}
        </p>
      </div>

      <div className="mt-8">
        <PropertyDraftForm
          universities={universities}
          amenities={amenities}
          mode={provider ? "provider" : "guest"}
        />
      </div>
    </div>
  );
}
