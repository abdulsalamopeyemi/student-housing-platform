export default function AuthLoadingSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading account page"
      className="mx-auto grid w-full max-w-6xl gap-0 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white lg:min-h-[690px] lg:grid-cols-[0.92fr_1.08fr]"
    >
      <span className="sr-only">Loading account page…</span>
      <div className="ui-skeleton min-h-64 lg:min-h-full" />
      <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
        <div className="ui-skeleton h-3 w-24 rounded" />
        <div className="ui-skeleton mt-4 h-10 w-3/4 rounded-xl" />
        <div className="ui-skeleton mt-3 h-4 w-full rounded" />
        <div className="ui-skeleton mt-2 h-4 w-5/6 rounded" />
        <div className="ui-skeleton mt-8 h-12 w-full rounded-xl" />
        <div className="ui-skeleton mt-4 h-12 w-full rounded-xl" />
        <div className="ui-skeleton mt-6 h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
