import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import PropertyImageManager from "@/components/provider/PropertyImageManager";
import {
  getProviderPropertyImageManager,
  serializePropertyImages,
} from "@/lib/data/provider-property-images";
import { getCurrentProvider } from "@/lib/data/providers";

interface ProviderPropertyImagesPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    message?: string;
  }>;
}

async function ProviderPropertyImagesContent({
  params,
  searchParams,
}: ProviderPropertyImagesPageProps) {
  const [{ id }, { user, provider }, query] = await Promise.all([
    params,
    getCurrentProvider(),
    searchParams,
  ]);

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(
        `/provider/properties/${id}/images`,
      )}`,
    );
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  if (provider.provider_type === "agent") {
    redirect(
      "/list-property?message=Agents+cannot+change+property+photos.",
    );
  }

  const property = await getProviderPropertyImageManager(id, provider.id);

  if (!property) {
    redirect(
      "/list-property?message=Property+could+not+be+found+in+your+workspace.",
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <Link
        href="/list-property"
        className="text-sm font-semibold text-[var(--emerald)]"
      >
        ← Back to provider workspace
      </Link>

      {query.message ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          {query.message}
        </div>
      ) : null}

      <div className="mt-6">
        <PropertyImageManager
          propertyId={property.id}
          propertyName={property.name}
          propertySlug={property.slug}
          publicationStatus={property.publication_status}
          initialImages={serializePropertyImages(property.property_images)}
        />
      </div>
    </div>
  );
}

export default function ProviderPropertyImagesPage(
  props: ProviderPropertyImagesPageProps,
) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
              <div className="h-12 max-w-xl animate-pulse rounded-2xl bg-[var(--cream)]" />
              <div className="mt-8 h-96 animate-pulse rounded-3xl bg-white" />
            </div>
          }
        >
          <ProviderPropertyImagesContent {...props} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
