import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/lib/data/account";
import { getStudentDashboardData } from "@/lib/data/student-dashboard";

function statusLabel(value: string) {
  return value.replaceAll("_", " ");
}

export default async function StudentAccountContent() {
  const { user, profile } = await getCurrentAccount();

  if (!user) {
    redirect("/login?next=/account");
  }

  if (profile?.role === "admin") {
    redirect("/admin/reviews");
  }

  if (profile?.role === "provider") {
    redirect("/list-property");
  }

  const { savedHomes, inspections } = await getStudentDashboardData();
  const displayName =
    profile?.full_name ?? user.user_metadata?.full_name ?? "Student";

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="rounded-3xl bg-[var(--forest)] p-7 text-white sm:p-9">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--gold)]">
          Student account
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Welcome, {displayName}.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-white/70">
          Keep the homes you are considering and your inspection activity in
          one place. Browsing the marketplace remains open to everyone.
        </p>
        <Link
          href="/explore"
          className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-[var(--forest)]"
        >
          Explore accommodation
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">Saved homes</p>
          <p className="mt-2 text-3xl font-bold text-[var(--forest)]">
            {savedHomes.length}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Properties you want to compare or revisit.
          </p>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold text-[var(--forest)]">
            Inspection requests
          </p>
          <p className="mt-2 text-3xl font-bold text-[var(--forest)]">
            {inspections.length}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Requests and their latest status.
          </p>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[var(--forest)]">Saved homes</h2>
            <Link href="/explore" className="text-sm font-bold text-[var(--emerald)]">
              Browse homes
            </Link>
          </div>

          {savedHomes.length === 0 ? (
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              You have not saved any properties yet. Browse the marketplace and
              save the homes you want to compare.
            </p>
          ) : (
            <div className="mt-5 divide-y divide-[var(--border)]">
              {savedHomes.map((item) => (
                <div key={item.property_id} className="py-4 first:pt-0">
                  {item.properties ? (
                    <Link
                      href={`/properties/${item.properties.slug}`}
                      className="font-bold text-[var(--forest)]"
                    >
                      {item.properties.name}
                    </Link>
                  ) : (
                    <p className="font-bold text-[var(--forest)]">Saved property</p>
                  )}
                  {item.properties ? (
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {item.properties.area}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-xl font-bold text-[var(--forest)]">
            Inspection activity
          </h2>

          {inspections.length === 0 ? (
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              You have no inspection requests yet. Open a published property
              and request an inspection when you are ready to visit it.
            </p>
          ) : (
            <div className="mt-5 divide-y divide-[var(--border)]">
              {inspections.map((item) => (
                <div key={item.id} className="py-4 first:pt-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {item.properties ? (
                        <Link
                          href={`/properties/${item.properties.slug}`}
                          className="font-bold text-[var(--forest)]"
                        >
                          {item.properties.name}
                        </Link>
                      ) : (
                        <p className="font-bold text-[var(--forest)]">Property inspection</p>
                      )}
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Preferred date: {new Date(item.preferred_date).toLocaleDateString("en-NG")}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {item.status === "requested"
                          ? "Waiting for the provider to respond."
                          : item.status === "confirmed"
                            ? "The provider confirmed this inspection."
                            : item.status === "completed"
                              ? "This inspection has been marked complete."
                              : item.status === "declined"
                                ? "The provider declined this inspection request."
                                : "This inspection request was cancelled."}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold capitalize text-[var(--forest)]">
                      {statusLabel(item.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
