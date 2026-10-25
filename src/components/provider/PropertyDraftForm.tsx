"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createPropertyDraft } from "@/app/provider/properties/new/actions";
import type { Amenity } from "@/lib/data/amenities";
import type { University } from "@/lib/data/universities";

const GUEST_DRAFT_KEY = "student-housing-guest-property-draft";

interface PropertyDraftFormProps {
  universities: University[];
  amenities: Amenity[];
  mode?: "guest" | "provider";
}

interface SavedGuestDraft {
  name: string;
  universityId: string;
  area: string;
  distanceLabel: string;
  description: string;
  roomType: string;
  annualRent: string;
  availableCount: string;
  feeLabels: string[];
  feeAmounts: string[];
  amenityIds: string[];
}

function inputValue(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name);

  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
    return field.value;
  }

  return "";
}

export default function PropertyDraftForm({
  universities,
  amenities,
  mode = "provider",
}: PropertyDraftFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [feeRows, setFeeRows] = useState([0]);
  const [savedDraft, setSavedDraft] = useState<SavedGuestDraft | null>(null);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      try {
        const rawDraft = window.localStorage.getItem(GUEST_DRAFT_KEY);

        if (!rawDraft) {
          return;
        }

        const draft = JSON.parse(rawDraft) as SavedGuestDraft;
        setSavedDraft(draft);
        setFeeRows(
          Array.from(
            { length: Math.max(1, draft.feeLabels?.length ?? 0) },
            (_, index) => index,
          ),
        );
      } catch {
        window.localStorage.removeItem(GUEST_DRAFT_KEY);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const form = formRef.current;

    if (!form || !savedDraft) {
      return;
    }

    const setSingleValue = (name: string, value: string) => {
      const field = form.elements.namedItem(name);

      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        field.value = value;
      }
    };

    setSingleValue("name", savedDraft.name ?? "");
    setSingleValue(
      "universityId",
      savedDraft.universityId || universities[0]?.id || "",
    );
    setSingleValue("area", savedDraft.area ?? "");
    setSingleValue("distanceLabel", savedDraft.distanceLabel ?? "");
    setSingleValue("description", savedDraft.description ?? "");
    setSingleValue("roomType", savedDraft.roomType ?? "");
    setSingleValue("annualRent", savedDraft.annualRent ?? "");
    setSingleValue("availableCount", savedDraft.availableCount ?? "1");

    form
      .querySelectorAll<HTMLInputElement>('input[name="feeLabel"]')
      .forEach((field, index) => {
        field.value = savedDraft.feeLabels?.[index] ?? "";
      });

    form
      .querySelectorAll<HTMLInputElement>('input[name="feeAmount"]')
      .forEach((field, index) => {
        field.value = savedDraft.feeAmounts?.[index] ?? "";
      });

    const selectedAmenities = new Set(savedDraft.amenityIds ?? []);

    form
      .querySelectorAll<HTMLInputElement>('input[name="amenities"]')
      .forEach((field) => {
        field.checked = selectedAmenities.has(field.value);
      });
  }, [savedDraft, feeRows.length, universities]);

  function addFeeRow() {
    setFeeRows((rows) => {
      const nextId = rows.length === 0 ? 0 : Math.max(...rows) + 1;
      return [...rows, nextId];
    });
  }

  function removeFeeRow(id: number) {
    setFeeRows((rows) => rows.filter((rowId) => rowId !== id));
  }

  function saveGuestDraftAndContinue(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    if (mode !== "guest") {
      return;
    }

    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const draft: SavedGuestDraft = {
      name: inputValue(form, "name"),
      universityId: inputValue(form, "universityId"),
      area: inputValue(form, "area"),
      distanceLabel: inputValue(form, "distanceLabel"),
      description: inputValue(form, "description"),
      roomType: inputValue(form, "roomType"),
      annualRent: inputValue(form, "annualRent"),
      availableCount: inputValue(form, "availableCount"),
      feeLabels: data.getAll("feeLabel").map(String),
      feeAmounts: data.getAll("feeAmount").map(String),
      amenityIds: data.getAll("amenities").map(String),
    };

    window.localStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify(draft));
    router.push("/login?next=%2Flist-property%2Fstart");
  }

  return (
    <form
      ref={formRef}
      action={mode === "provider" ? createPropertyDraft : undefined}
      onSubmit={mode === "guest" ? saveGuestDraftAndContinue : undefined}
      className="space-y-8"
    >
      {savedDraft ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          Your saved browser draft has been restored.
        </div>
      ) : null}

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Property basics
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Property name
            </span>
            <input
              required
              name="name"
              type="text"
              placeholder="e.g. Victory Lodge"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              University
            </span>
            <select
              required
              name="universityId"
              defaultValue={universities[0]?.id ?? ""}
              className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-[var(--emerald)]"
            >
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Area / neighbourhood
            </span>
            <input
              required
              name="area"
              type="text"
              placeholder="e.g. Malete"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Distance description
            </span>
            <input
              name="distanceLabel"
              type="text"
              placeholder="e.g. About 8 minutes from KWASU by bike"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Property description
            </span>
            <textarea
              required
              minLength={20}
              name="description"
              rows={5}
              placeholder="Describe the accommodation, access, compound, water situation, and other useful facts."
              className="w-full resize-y rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          First room type
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Room type
            </span>
            <input
              required
              name="roomType"
              type="text"
              placeholder="Self-contained room"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Annual rent (₦)
            </span>
            <input
              required
              min="1"
              step="1000"
              name="annualRent"
              type="number"
              placeholder="250000"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Available rooms
            </span>
            <input
              required
              min="0"
              step="1"
              name="availableCount"
              type="number"
              defaultValue="1"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
              Required fees
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Add mandatory costs students must know before deciding.
            </p>
          </div>

          <button
            type="button"
            onClick={addFeeRow}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--forest)]"
          >
            + Add fee
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {feeRows.map((rowId) => (
            <div
              key={rowId}
              className="grid gap-3 sm:grid-cols-[1fr_0.55fr_auto]"
            >
              <input
                name="feeLabel"
                type="text"
                placeholder="e.g. Agreement / documentation"
                className="rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
              />
              <input
                min="0"
                step="500"
                name="feeAmount"
                type="number"
                placeholder="15000"
                className="rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
              />
              <button
                type="button"
                onClick={() => removeFeeRow(rowId)}
                disabled={feeRows.length === 1}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-[var(--muted)] disabled:opacity-30"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Amenities
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity) => (
            <label
              key={amenity.id}
              className="flex items-start gap-3 rounded-2xl bg-[var(--cream)] p-4"
            >
              <input
                type="checkbox"
                name="amenities"
                value={amenity.id}
                className="mt-1 h-4 w-4"
              />
              <span>
                <span className="block text-sm font-semibold text-[var(--forest)]">
                  {amenity.name}
                </span>
                <span className="mt-1 block text-xs capitalize text-[var(--muted)]">
                  {amenity.category}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[var(--forest)] p-6 text-white">
        <div>
          <p className="font-bold">
            {mode === "guest" ? "Continue with your listing" : "Save as a draft"}
          </p>
          <p className="mt-1 text-sm text-white/65">
            {mode === "guest"
              ? "We will keep these details in this browser, then ask you to sign in before saving them to the platform."
              : "This does not publish or verify the property."}
          </p>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-[var(--gold)] px-5 py-3 font-bold text-[var(--ink)]"
        >
          {mode === "guest" ? "Continue to sign in" : "Save property draft"}
        </button>
      </div>
    </form>
  );
}
