interface AdminDataUnavailableProps {
  section: string;
}

export default function AdminDataUnavailable({
  section,
}: AdminDataUnavailableProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="rounded-3xl border border-[var(--border)] bg-white p-7 sm:p-9">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          {section}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[var(--forest)] sm:text-4xl">
          The workspace is waiting on its data connection.
        </h1>
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950"
        >
          <h2 className="font-bold">Connect the admin workspace</h2>
          <p className="mt-2">
          Admin credentials sign you in, but this workspace still needs
          <code className="mx-1 rounded bg-amber-100 px-1.5 py-0.5 font-mono">
            SUPABASE_SECRET_KEY
          </code>
          to load and manage listings, reports, support requests, and payout
          setup. Add it to the hosting environment for the same Supabase project
          as the app, keep it server-only, and redeploy.
          </p>
        </div>
      </div>
    </div>
  );
}
