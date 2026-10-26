import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import PropertyEditForm from "@/components/provider/PropertyEditForm";
import { getAmenities } from "@/lib/data/amenities";
import {
  getEditableProviderProperty,
  getLatestPropertyReviewFeedback,
} from "@/lib/data/provider-properties";
import { getCurrentProvider } from "@/lib/data/providers";
import { getUniversities } from "@/lib/data/universities";

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    message?: string;
  }>;
}

async function EditPropertyContent({
  params,
  searchParams,
}: EditPropertyPageProps) {
  const [{ id }, query, { user, provider }, universities, amenities] =
    await Promise.all([
      params,
      searchParams,
      getCurrentProvider(),
      getUniversities(),
      getAmenities(),
    ]);

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(
        `/provider/properties/${id}/edit`,
      )}`,
    );
  }

  if (!provider) {
    redirect("/provider/onboarding");
  }

  if (provider.provider_type === "agent") {
    redirect(
      "/list-property?message=Agents+can+manage+availability+but+cannot+edit+owner+listing+details.",
    );
  }

  const property = await getEditableProviderProperty(id, provider.id);

  if (!property) {
    redirect(
      "/list-property?message=Property+could+not+be+found+in+your+workspace.",
    );
  }

  if (!["draft", "rejected"].includes(property.publication_status)) {
    redirect(
      "/list-property?message=This+listing+is+locked+while+under+review+or+published.",
    );
  }

  const reviewFeedback =
    property.publication_status === "rejected"
      ? await getLatestPropertyReviewFeedback(property.id)
      : null;

  return (
        <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
          <Link
            href="/list-property"
            className="text-sm font-semibold text-[var(--emerald)]"
          >
            ← Back to provider workspace
          </Link>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
                Property editor
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
                Improve {property.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
                Correct the listing details, keep all mandatory costs transparent,
                and make sure availability matches what students can actually rent.
              </p>
            </div>

            <Link
              href={`/provider/properties/${property.id}/images`}
              className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-center text-sm font-semibold text-[var(--forest)]"
            >
              Manage property photos
            </Link>
          </div>

          {query.message ? (
            <div
              role="status"
              className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
            >
              {query.message}
            </div>
          ) : null}

          {reviewFeedback?.notes ? (
            <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                Admin review feedback
              </p>
              <h2 className="mt-2 text-xl font-bold text-amber-950">
                Fix this before resubmitting
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-amber-900">
                {reviewFeedback.notes}
              </p>
              <p className="mt-3 text-xs text-amber-800">
                Reviewed {new Date(reviewFeedback.created_at).toLocaleDateString("en-NG")}
              </p>
            </section>
          ) : property.publication_status === "rejected" ? (
            <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-sm font-semibold text-amber-900">
                This listing was returned for changes. Review the property details
                and photos carefully before resubmitting.
              </p>
            </section>
          ) : null}

          <div className="mt-8">
            <PropertyEditForm
              property={property}
              universities={universities}
              amenities={amenities}
            />
          </div>
        </div>
  );
}

export default function EditPropertyPage(props: EditPropertyPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-[var(--paper)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
              <div className="h-12 max-w-xl animate-pulse rounded-2xl bg-[var(--cream)]" />
              <div className="mt-8 h-96 animate-pulse rounded-3xl bg-white" />
            </div>
          }
        >
          <EditPropertyContent {...props} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
