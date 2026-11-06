import Link from "next/link";
import { redirect } from "next/navigation";

import { getStudentPaymentByReference } from "@/lib/data/accommodation-payments";
import { getCurrentAccount } from "@/lib/data/account";
import { verifyAndRecordPaystackPayment } from "@/lib/payments/verification";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

interface PaymentVerifyContentProps {
  searchParams: Promise<{
    reference?: string;
  }>;
}

export default async function PaymentVerifyContent({
  searchParams,
}: PaymentVerifyContentProps) {
  const [{ user, profile }, query] = await Promise.all([
    getCurrentAccount(),
    searchParams,
  ]);

  const reference = query.reference?.trim() ?? "";

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(
        `/payments/verify?reference=${reference}`,
      )}`,
    );
  }

  if (profile?.role !== "student") {
    redirect("/account");
  }

  if (!reference) {
    redirect("/account?message=Payment+reference+is+missing.");
  }

  let verificationMessage =
    "We could not verify this payment yet. You can check again from My Account.";

  try {
    const result = await verifyAndRecordPaystackPayment(reference);
    verificationMessage = result.message;
  } catch {
    verificationMessage =
      "We could not reach the payment provider to verify this transaction yet.";
  }

  const payment = await getStudentPaymentByReference(reference);

  if (!payment) {
    redirect(
      "/account?message=This+payment+does+not+belong+to+your+student+account.",
    );
  }

  const amount = currencyFormatter.format(payment.amount_kobo / 100);
  const paid = payment.status === "paid";

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-white p-7 sm:p-9">
      <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
        Payment status
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--forest)]">
        {paid ? "Payment verified." : "Payment not completed yet."}
      </h1>
      <p className="mt-4 leading-7 text-[var(--muted)]">
        {verificationMessage}
      </p>

      <div className="mt-7 rounded-2xl bg-[var(--cream)] p-5">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Property
            </dt>
            <dd className="mt-1 font-bold text-[var(--forest)]">
              {payment.properties?.name ?? "Accommodation payment"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Amount
            </dt>
            <dd className="mt-1 font-bold text-[var(--forest)]">
              {amount}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Reference
            </dt>
            <dd className="mt-1 break-all font-mono text-sm text-[var(--forest)]">
              {payment.reference}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Status
            </dt>
            <dd className="mt-1 font-bold capitalize text-[var(--forest)]">
              {payment.status}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/account"
          className="rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white"
        >
          Return to My Account
        </Link>
        {payment.properties ? (
          <Link
            href={`/properties/${payment.properties.slug}`}
            className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--forest)]"
          >
            View property
          </Link>
        ) : null}
      </div>
    </section>
  );
}
