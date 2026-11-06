import LegalPageLayout from "@/components/legal/LegalPageLayout";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[var(--paper)]">
        <LegalPageLayout
          eyebrow="Terms of use"
          title="A clear starting point for using the marketplace."
          summary="These draft terms describe how students and accommodation providers use Student Housing. The operator’s legal identity, governing law, payment terms, and complaint process must be reviewed before launch."
          sections={[
            {
              title: "What the service does",
              content: (
                <p>
                  Student Housing helps students discover accommodation,
                  compare listing information, save homes, and request
                  inspections. It also gives providers tools to submit and
                  manage listings. The platform is a marketplace and is not
                  itself the landlord or tenant.
                </p>
              ),
            },
            {
              title: "Accounts and accurate information",
              content: (
                <p>
                  Keep your account details accurate and protect your password
                  and confirmation links. Providers are responsible for having
                  authority to list a property and for keeping its description,
                  photos, prices, fees, and availability accurate. Do not
                  impersonate another person or submit misleading information.
                </p>
              ),
            },
            {
              title: "Listings, verification, and inspections",
              content: (
                <p>
                  Listings may be reviewed before publication. A platform
                  verification or approval label describes the review completed
                  by Student Housing; it is not a guarantee of a property’s
                  condition, continuing availability, safety, ownership, or a
                  provider’s future conduct. An inspection request is an
                  enquiry only: it does not reserve a room or create a tenancy.
                  Students and providers should confirm details directly before
                  making a housing decision.
                </p>
              ),
            },
            {
              title: "Payments",
              content: (
                <p>
                  The product includes a payment checkout flow for eligible
                  accommodation enquiries. Review the amount, recipient, and
                  payment details shown at checkout before authorizing a
                  transaction. Refund eligibility, disputes, platform fees,
                  provider payout timing, and applicable payment terms have not
                  yet been confirmed for this draft and must be clearly defined
                  before live payments are enabled.
                </p>
              ),
            },
            {
              title: "Acceptable use and reports",
              content: (
                <p>
                  Do not use the service to defraud, harass, discriminate,
                  distribute harmful material, interfere with other users, or
                  bypass platform safeguards. You can report a suspicious or
                  inaccurate listing. Student Housing may review reports and
                  restrict content or accounts under rules that need final
                  operator and legal approval.
                </p>
              ),
            },
            {
              title: "Operator, governing law, and changes",
              content: (
                <p>
                  “Phantom” is the working operator name supplied for this
                  draft; the registered entity name, business address,
                  governing law, liability terms, dispute process, and effective
                  date remain to be confirmed. We will publish a dated revision
                  when those terms have been reviewed. Do not treat this draft
                  as a final contract.
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
