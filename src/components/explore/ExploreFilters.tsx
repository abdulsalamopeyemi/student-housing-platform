"use client";

import { useState } from "react";

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
  const [locationValue, setLocationValue] = useState(location);
  const hasLocation = locationValue.trim().length > 0;

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
            required
            type="text"
            name="location"
            value={locationValue}
            onChange={(event) => setLocationValue(event.target.value)}
            placeholder="e.g. KWASU, Malete"
            aria-describedby="location-filter-help"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
          />
          <p
            id="location-filter-help"
            className="mt-1.5 text-xs leading-5 text-[var(--muted)]"
          >
            Enter a university or area first, then refine by budget or room type.
          </p>
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
          disabled={!hasLocation}
          className="self-end rounded-xl bg-[var(--forest)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--emerald)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          Apply filters
        </button>
      </div>

      {!hasLocation ? (
        <p className="mt-4 text-sm font-medium text-amber-800">
          Enter a university or area to use the filters. You can still browse all approved homes below.
        </p>
      ) : null}
    </form>
  );
}
