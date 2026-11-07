import { adminSignIn } from "@/app/admin/sign-in/actions";
import PasswordField from "@/components/auth/PasswordField";
import ActionSubmitButton from "@/components/ui/ActionSubmitButton";
import { safeAdminNextPath } from "@/lib/supabase/auth-shared";

interface AdminSignInContentProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
}

export default async function AdminSignInContent({
  searchParams,
}: AdminSignInContentProps) {
  const params = await searchParams;
  const nextPath = safeAdminNextPath(params.next);

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--cream)] px-4 py-8 sm:px-6 sm:py-12">
      <section className="ui-enter grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white shadow-[0_32px_90px_-46px_rgba(20,54,49,0.42)] md:min-h-[680px] md:grid-cols-[0.92fr_1.08fr]">
        <div className="relative flex min-h-[520px] flex-col justify-between overflow-hidden bg-[var(--forest)] p-7 text-white sm:p-10 md:min-h-full lg:p-12">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden opacity-[0.12]">
            <div className="absolute -right-28 -top-28 size-[26rem] rounded-full border border-white" />
            <div className="absolute -right-12 -top-12 size-[22rem] rounded-full border border-white" />
          </div>
          <div className="relative flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-white/20 bg-white/10 text-xs font-black tracking-wide text-[var(--gold)]">
              SH
            </span>
            <span>
              <span className="block text-sm font-bold tracking-wide">
                Student Housing
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                Operations desk
              </span>
            </span>
          </div>
          <div className="relative mt-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--gold)]" />
              Restricted workspace
            </p>
            <h1 className="mt-5 max-w-sm font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
              The work behind every trusted listing.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/75">
              Review providers, approve accommodation, and keep the marketplace
              accountable from one private workspace.
            </p>
          </div>
          <div className="relative mt-10 max-w-sm border-l border-white/20 pl-5">
            {[
              { label: "Provider verification", step: "Confirm who can list" },
              { label: "Listing review", step: "Check what students see" },
              { label: "Marketplace care", step: "Resolve reports and requests" },
            ].map((item) => (
              <div key={item.label} className="relative pb-5 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.55rem] top-1 grid size-3 place-items-center rounded-full border border-[var(--gold)] bg-[var(--forest)]"
                >
                  <span className="size-1 rounded-full bg-[var(--gold)]" />
                </span>
                <p className="text-xs font-semibold text-white/90">
                  {item.label}
                </p>
                <p className="mt-1 text-[11px] text-white/55">{item.step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center px-6 py-10 sm:px-10 sm:py-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--emerald)]">
                Administrator access
              </p>
              <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--forest)]">
                Private
              </span>
            </div>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
              Welcome to the operations desk.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Sign in with the administrator credentials configured for this
              deployment.
            </p>

            {params.error ? (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-800"
              >
                {params.error}
              </div>
            ) : null}

            {params.message ? (
              <div
                role="status"
                className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-900"
              >
                {params.message}
              </div>
            ) : null}

            <form action={adminSignIn} className="mt-6 space-y-4">
              <input type="hidden" name="next" value={nextPath} />
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                  Admin email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="username"
                  inputMode="email"
                  spellCheck={false}
                  className="auth-input"
                />
              </label>

              <PasswordField
                name="password"
                label="Admin password"
                autoComplete="current-password"
                backgroundClassName="bg-white"
              />

              <ActionSubmitButton
                pendingText="Signing you in…"
                className="auth-primary-button"
              >
                Enter admin workspace
              </ActionSubmitButton>
            </form>

            <p className="mt-6 border-t border-[var(--border)] pt-5 text-xs leading-5 text-[var(--muted)]">
              This sign-in is for platform administrators. Public student and
              landlord accounts use the main sign-in page.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
