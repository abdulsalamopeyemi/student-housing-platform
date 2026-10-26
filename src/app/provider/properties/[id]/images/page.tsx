import Link from "next/link";
import { redirect } from "next/navigation";

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
}

export default async function ProviderPropertyImagesPage({
  params,
}: ProviderPropertyImagesPageProps) {
  const [{ id }, { user, provider }] = await Promise.all([
    params,
    getCurrentProvider(),
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
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
          <Link
            href="/list-property"
            className="text-sm font-semibold text-[var(--emerald)]"
          >
            ← Back to provider workspace
          </Link>

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
      </main>
      <SiteFooter />
    </>
  );
}
