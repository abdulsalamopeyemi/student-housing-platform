"use client";

import { useEffect, useId, useMemo, useState } from "react";

import type { University } from "@/lib/data/universities";

interface UniversitySearchSelectProps {
  universities: University[];
  name: string;
  value?: string;
  valueMode?: "id" | "name";
  placeholder?: string;
  required?: boolean;
  ariaInvalid?: boolean;
  onValueChange?: (value: string) => void;
  inputClassName?: string;
}

export default function UniversitySearchSelect({
  universities,
  name,
  value = "",
  valueMode = "name",
  placeholder = "Search university...",
  required = false,
  ariaInvalid = false,
  onValueChange,
  inputClassName = "",
}: UniversitySearchSelectProps) {
  const listId = useId();
  const selectedUniversity = universities.find((university) =>
    valueMode === "id" ? university.id === value : university.name === value,
  );

  const [query, setQuery] = useState(selectedUniversity?.name ?? "");
  const [selectedValue, setSelectedValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const nextUniversity = universities.find((university) =>
      valueMode === "id" ? university.id === value : university.name === value,
    );

    setSelectedValue(value);
    setQuery(nextUniversity?.name ?? "");
  }, [universities, value, valueMode]);

  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return universities.slice(0, 8);
    }

    return universities
      .filter((university) => {
        const haystack = [
          university.name,
          university.city,
          university.state,
          university.ownership ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [query, universities]);

  function selectUniversity(university: University) {
    const nextValue =
      valueMode === "id" ? university.id : university.name;

    setQuery(university.name);
    setSelectedValue(nextValue);
    setIsOpen(false);
    onValueChange?.(nextValue);
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setSelectedValue("");
    setIsOpen(true);
    onValueChange?.("");
  }

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selectedValue} />

      <input
        data-university-combobox-input={name}
        type="text"
        value={query}
        required={required}
        autoComplete="off"
        placeholder={placeholder}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-invalid={ariaInvalid}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => handleQueryChange(event.target.value)}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 120);
        }}
        className={inputClassName}
      />

      {isOpen ? (
        <div
          id={listId}
          role="listbox"
          className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-[var(--border)] bg-white p-2 shadow-xl shadow-black/10"
        >
          {matches.length > 0 ? (
            matches.map((university) => (
              <button
                key={university.id}
                type="button"
                role="option"
                aria-selected={selectedValue === (valueMode === "id" ? university.id : university.name)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectUniversity(university)}
                className="w-full rounded-xl px-3 py-3 text-left transition hover:bg-[var(--cream)]"
              >
                <span className="block text-sm font-semibold text-[var(--forest)]">
                  {university.name}
                </span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  {[university.city, university.state, university.ownership]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-sm text-[var(--muted)]">
              No university matches “{query}”.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
