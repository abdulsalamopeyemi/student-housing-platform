import LegalPageLayout from "@/components/legal/LegalPageLayout";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[var(--paper)]">
        <LegalPageLayout
          eyebrow="Privacy"
          title="Your information should help you find housing—not surprise you."
          summary="This draft explains the personal information the current product flows use, why they use it, and which service providers are involved. Retention periods, hosting region, legal entity, and the final privacy process still need confirmation."
          sections={[
            {
              title: "Information used by the service",
              content: (
                <>
                  <p>
                    Depending on how you use the platform, information may
                    include your name and email address; account phone number
                    and university affiliation; saved properties; inspection
                    dates, group size, contact phone number, and notes; support
                    requests; and provider account and property listing details,
                    including submitted property photos.
                  </p>
                  <p>
                    If you use accommodation checkout, payment records may
                    include the amount, currency, status, reference, and
                    verification details. Payment card information is handled by
                    the payment provider; the application is not designed to
                    store card numbers or security codes.
                  </p>
                </>
              ),
            },
            {
              title: "Why the information is used",
              content: (
                <p>
                  Account details support sign-in and the correct student,
                  provider, or administrator workspace. Listing and preference
                  information powers property discovery and saved homes.
                  Inspection contact details are shared with the provider of
                  the property you enquire about so they can coordinate with
                  you. Reports and support messages are available to authorized
                  platform administrators for review.
                </p>
              ),
            },
            {
              title: "Service providers and sharing",
              content: (
                <p>
                  The product uses Supabase for authentication, database, and
                  related hosting services, and Paystack for payment checkout
                  and transaction processing. An inspection request shares the
                  contact details and message you submitted with the relevant
                  property provider. Supabase or its configured email delivery
                  provider may send account messages. The exact hosting region,
                  email provider, subprocessors, and cross-border transfer
                  arrangements must be confirmed before launch.
                </p>
              ),
            },
            {
              title: "Cookies and analytics",
              content: (
                <p>
                  Secure, HTTP-only cookies are used to keep your authentication
                  session. No product analytics integration was found in the
                  current application code. Any analytics, advertising, or
                  optional cookie tools added later should be disclosed and
                  configured before use.
                </p>
              ),
            },
            {
              title: "Security, retention, and your choices",
              content: (
                <p>
                  The application uses role-based access controls and database
                  policies to limit access to account and operational records.
                  No retention schedule or self-service account deletion flow
                  has been confirmed yet. To ask about access, correction, or
                  deletion of your information, contact support. The operator
                  must establish retention periods, identity checks, response
                  timelines, and an account deletion process before this draft
                  is treated as final.
                </p>
              ),
            },
            {
              title: "Operator and applicable law",
              content: (
                <p>
                  “Phantom” is the working operator name supplied for this
                  draft, not a confirmed legal entity. The platform’s initial
                  product focus is KWASU / Malete, Nigeria, but the responsible
                  legal entity, applicable privacy law, contact address, and
                  effective date require confirmation and legal review.
                </p>
              ),
            },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
