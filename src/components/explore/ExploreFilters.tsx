"use client";

import { useState } from "react";

import UniversitySearchSelect from "@/components/forms/UniversitySearchSelect";
import type { University } from "@/lib/data/universities";

interface ExploreFiltersProps {
  universities: University[];
  university: string;
  area: string;
  budget: string;
  roomType: string;
}

export default function ExploreFilters({
  universities,
  university,
  area,
  budget,
  roomType,
}: ExploreFiltersProps) {
  const [universityValue, setUniversityValue] = useState(university);
  const [showUniversityError, setShowUniversityError] = useState(false);
  const hasUniversity = universityValue.trim().length > 0;

  function handleUniversityChange(value: string) {
    setUniversityValue(value);

    if (value.trim()) {
      setShowUniversityError(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (hasUniversity) {
      return;
    }

    event.preventDefault();
    setShowUniversityError(true);
  }

  return (
    <form
      action="/explore"
      method="get"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--border)] bg-white p-5"
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_0.9fr_1fr_auto]">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            University
          </label>
          <UniversitySearchSelect
            universities={universities}
            name="university"
            value={universityValue}
            valueMode="name"
            onValueChange={handleUniversityChange}
            placeholder="Type a university name..."
            inputClassName="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--emerald)]"
          />
          <p
            id="university-filter-help"
            className="mt-1.5 text-xs leading-5 text-[var(--muted)]"
          >
            Start typing a university name, then select the correct result.
          </p>
        </div>

        <label>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            Area / neighbourhood
          </span>
          <input
            type="text"
            name="area"
            defaultValue={area}
            placeholder="e.g. Malete"
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
            <option value="750000">Up to ₦750,000</option>
            <option value="1000000">Up to ₦1,000,000</option>
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

      {showUniversityError ? (
        <p role="alert" className="mt-4 text-sm font-medium text-amber-800">
          Select a university before applying filters. You can still browse all approved homes below.
        </p>
      ) : null}
    </form>
  );
}
