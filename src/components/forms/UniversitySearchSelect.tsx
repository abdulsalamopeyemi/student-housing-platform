"use client";

import {
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";

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

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
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
  const [activeIndex, setActiveIndex] = useState(-1);

  const matches = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    if (!normalizedQuery) {
      return universities.slice(0, 8);
    }

    return universities
      .filter((university) => {
        const haystack = normalizeSearch(
          [
            university.name,
            university.city,
            university.state,
            university.ownership ?? "",
          ].join(" "),
        );

        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => {
        const aStarts = normalizeSearch(a.name).startsWith(normalizedQuery);
        const bStarts = normalizeSearch(b.name).startsWith(normalizedQuery);

        return Number(bStarts) - Number(aStarts) || a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [query, universities]);

  function selectUniversity(university: University) {
    const nextValue = valueMode === "id" ? university.id : university.name;

    setQuery(university.name);
    setSelectedValue(nextValue);
    setIsOpen(false);
    setActiveIndex(-1);
    onValueChange?.(nextValue);
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setSelectedValue("");
    setActiveIndex(-1);
    setIsOpen(true);
    onValueChange?.("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        matches.length === 0
          ? -1
          : current < 0
            ? 0
            : Math.min(current + 1, matches.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        matches.length === 0
          ? -1
          : current < 0
            ? matches.length - 1
            : Math.max(current - 1, 0),
      );
      return;
    }

    if (event.key === "Enter" && isOpen && activeIndex >= 0 && matches[activeIndex]) {
      event.preventDefault();
      selectUniversity(matches[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
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
        aria-label="Search and select a university"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={
          isOpen && activeIndex >= 0 && matches[activeIndex]
            ? `${listId}-option-${activeIndex}`
            : undefined
        }
        aria-invalid={ariaInvalid}
        aria-required={required}
        onFocus={() => {
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onChange={(event) => handleQueryChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 120);
        }}
        className={inputClassName}
      />

      {isOpen ? (
        <div
          id={listId}
          role="listbox"
          aria-label="University search results"
          className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-[var(--border)] bg-white p-2 shadow-xl shadow-black/10"
        >
          {matches.length > 0 ? (
            matches.map((university, index) => {
              const optionValue =
                valueMode === "id" ? university.id : university.name;
              const isActive = index === activeIndex;

              return (
                <button
                  key={university.id}
                  id={`${listId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={selectedValue === optionValue}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectUniversity(university)}
                  className={[
                    "w-full rounded-xl px-3 py-3 text-left transition",
                    isActive ? "bg-[var(--cream)]" : "hover:bg-[var(--cream)]",
                  ].join(" ")}
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
              );
            })
          ) : (
            <p className="px-3 py-4 text-sm text-[var(--muted)]">
              No university matches “{query}”. Try a shorter name or state.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
