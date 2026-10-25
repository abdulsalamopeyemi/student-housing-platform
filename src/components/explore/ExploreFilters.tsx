interface ExploreFiltersProps {
  location: string;
  budget: string;
  roomType: string;
}

export default function ExploreFilters({
  location,
  budget,
  roomType,
}: ExploreFiltersProps) {
  return (
    <form
      action="/explore"
      method="get"
      className="rounded-3xl border border-[var(--border)] bg-white p-5"
    >
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr_auto]">
        <label>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            University or area
          </span>
          <input
            type="text"
            name="location"
            defaultValue={location}
            placeholder="e.g. KWASU, Malete"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Maximum budget
          </span>
          <select
            name="budget"
            defaultValue={budget}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
          >
            <option value="">Any budget</option>
            <option value="150000">Up to ₦150,000</option>
            <option value="250000">Up to ₦250,000</option>
            <option value="350000">Up to ₦350,000</option>
            <option value="500000">Up to ₦500,000</option>
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Room type
          </span>
          <select
            name="roomType"
            defaultValue={roomType}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
          >
            <option value="">Any room type</option>
            <option value="single">Single room</option>
            <option value="self-contained">Self-contained room</option>
          </select>
        </label>

        <button
          type="submit"
          className="self-end rounded-xl bg-[var(--forest)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--emerald)]"
        >
          Apply filters
        </button>
      </div>
    </form>
  );
}
