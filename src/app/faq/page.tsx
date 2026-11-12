import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about finding student accommodation, property listings, inspections, and payments.",
};

const faqSections = [
  {
    id: "finding-a-place",
    title: "Finding a place",
    questions: [
      {
        question: "How do I find accommodation?",
        answer:
          "Explore published homes to compare their location, rent, room availability, and facilities. Open a listing for its details, and contact the provider to confirm anything important before making a decision.",
      },
      {
        question: "What does a verified listing mean?",
        answer:
          "A verified label means the listing has gone through the platform's review workflow. It is not a guarantee of a property's condition, continuing availability, ownership, safety, or a provider's future conduct. Please confirm details directly with the provider.",
      },
      {
        question: "How current is the availability information?",
        answer:
          "Listings show when availability was last updated. Availability can change, so contact the provider to confirm that a room is still available before making plans.",
      },
      {
        question: "Can I save a property?",
        answer:
          "Yes. Sign in to your student account and use the save control on a property to keep it in your account for later.",
      },
    ],
  },
  {
    id: "inspections-and-payments",
    title: "Inspections and payments",
    questions: [
      {
        question: "Does an inspection request reserve a room?",
        answer:
          "No. An inspection request is an enquiry to coordinate a viewing; it does not reserve a room or create a tenancy. Wait for the provider to respond and confirm arrangements with them.",
      },
      {
        question: "How do I check an inspection request?",
        answer:
          "Sign in and open your account to review your inspection requests and their status. You can manage eligible requests from there.",
      },
      {
        question: "What should I know before making a payment?",
        answer:
          "Only continue through the platform's payment checkout when it is offered. Before authorizing, carefully check the amount, currency, recipient, and payment details shown at checkout. Never share your card number, security code, password, or sign-in code in a message.",
      },
      {
        question: "What if I have a question about a payment or refund?",
        answer:
          "Contact the support team with the payment reference and a description of the issue. Refund eligibility and payment dispute terms depend on the applicable transaction terms, so check those terms before paying.",
      },
    ],
  },
  {
    id: "providers-and-account-help",
    title: "Providers and account help",
    questions: [
      {
        question: "How can I list a property?",
        answer:
          "Start from the List a property page and follow the steps to create your provider account and submit a listing. A submitted listing may need review before it is published.",
      },
      {
        question: "Where can I get more help?",
        answer:
          "Visit the support page to send a request or find the support email address. Please do not include passwords, verification codes, or payment card details.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[var(--paper)]">
        <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8 lg:py-20">
          <header className="border-b border-[var(--border)] pb-8">
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--emerald)]">
              Help centre
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)] sm:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Find answers about searching for a student home, arranging an
              inspection, managing a listing, and using the platform.
            </p>
          </header>

          <div className="mt-10 space-y-10">
            {faqSections.map((section) => (
              <section key={section.id} aria-labelledby={section.id}>
                <h2
                  id={section.id}
                  className="text-2xl font-bold text-[var(--forest)]"
                >
                  {section.title}
                </h2>
                <div className="mt-4 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-white px-5">
                  {section.questions.map((item) => (
                    <details key={item.question} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--ink)] marker:hidden [&::-webkit-details-marker]:hidden">
                        {item.question}
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-xl text-[var(--emerald)] transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 max-w-3xl pr-8 text-sm leading-7 text-[var(--muted)]">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="mt-12 flex flex-col gap-4 rounded-3xl bg-[var(--forest)] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="text-xl font-bold">Still need a hand?</h2>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Our support page has more ways to get in touch.
              </p>
            </div>
            <Link
              href="/support"
              className="inline-flex shrink-0 justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--cream)]"
            >
              Contact support
            </Link>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
