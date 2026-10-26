"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createPropertyDraft } from "@/app/provider/properties/new/actions";
import UniversitySearchSelect from "@/components/forms/UniversitySearchSelect";
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
  totalCount: string;
  availableCount: string;
  feeLabels: string[];
  feeAmounts: string[];
  amenityIds: string[];
}

type PropertyField =
  | "name"
  | "universityId"
  | "area"
  | "description"
  | "roomType"
  | "annualRent"
  | "totalCount"
  | "availableCount";

type FieldErrors = Partial<Record<PropertyField, string>>;

function ErrorMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
      {message}
    </p>
  );
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
  const [allAmenitiesSelected, setAllAmenitiesSelected] = useState(false);
  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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
    setSelectedUniversityId(savedDraft.universityId || "");
    setSingleValue("area", savedDraft.area ?? "");
    setSingleValue("distanceLabel", savedDraft.distanceLabel ?? "");
    setSingleValue("description", savedDraft.description ?? "");
    setSingleValue("roomType", savedDraft.roomType ?? "");
    setSingleValue("annualRent", savedDraft.annualRent ?? "");
    setSingleValue("totalCount", savedDraft.totalCount ?? savedDraft.availableCount ?? "1");
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

    const amenityFields = Array.from(
      form.querySelectorAll<HTMLInputElement>('input[name="amenities"]'),
    );

    amenityFields.forEach((field) => {
      field.checked = selectedAmenities.has(field.value);
    });

    setAllAmenitiesSelected(
      amenityFields.length > 0 && amenityFields.every((field) => field.checked),
    );
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

  function syncAllAmenitiesSelected() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const amenityFields = Array.from(
      form.querySelectorAll<HTMLInputElement>('input[name="amenities"]'),
    );

    setAllAmenitiesSelected(
      amenityFields.length > 0 && amenityFields.every((field) => field.checked),
    );
  }

  function toggleAllAmenities() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const nextChecked = !allAmenitiesSelected;

    form
      .querySelectorAll<HTMLInputElement>('input[name="amenities"]')
      .forEach((field) => {
        field.checked = nextChecked;
      });

    setAllAmenitiesSelected(nextChecked);
  }

  function validatePropertyForm(form: HTMLFormElement) {
    const errors: FieldErrors = {};
    const name = inputValue(form, "name").trim();
    const universityId = inputValue(form, "universityId");
    const area = inputValue(form, "area").trim();
    const description = inputValue(form, "description").trim();
    const roomType = inputValue(form, "roomType").trim();
    const annualRent = Number(inputValue(form, "annualRent"));
    const totalRooms = Number(inputValue(form, "totalCount"));
    const availableRooms = Number(inputValue(form, "availableCount"));

    if (name.length < 3) {
      errors.name = "Enter a property name with at least 3 characters.";
    }

    if (!universityId) {
      errors.universityId = "Choose the university this property serves.";
    }

    if (area.length < 2) {
      errors.area = "Enter the property area or neighbourhood.";
    }

    if (description.length < 20) {
      errors.description =
        "Describe the property in at least 20 characters so students know what to expect.";
    }

    if (roomType.length < 2) {
      errors.roomType = "Enter a room type, for example Self-contained.";
    }

    if (!Number.isFinite(annualRent) || annualRent <= 0) {
      errors.annualRent = "Enter a valid annual rent greater than ₦0.";
    }

    if (!Number.isInteger(totalRooms) || totalRooms < 1) {
      errors.totalCount = "Total rooms must be a whole number of at least 1.";
    }

    if (!Number.isInteger(availableRooms) || availableRooms < 0) {
      errors.availableCount = "Available rooms must be a whole number from 0 upward.";
    } else if (Number.isInteger(totalRooms) && availableRooms > totalRooms) {
      errors.availableCount = "Available rooms cannot be greater than total rooms.";
    }

    return errors;
  }

  function focusFirstError(errors: FieldErrors) {
    const firstField = Object.keys(errors)[0] as PropertyField | undefined;

    if (!firstField) {
      return;
    }

    window.requestAnimationFrame(() => {
      if (firstField === "universityId") {
        const universityInput = formRef.current?.querySelector<HTMLInputElement>(
          '[data-university-combobox-input="universityId"]',
        );

        universityInput?.focus({ preventScroll: true });
        universityInput?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const field = formRef.current?.elements.namedItem(firstField);

      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        field.focus({ preventScroll: true });
        field.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  function handleFormInput(event: React.FormEvent<HTMLFormElement>) {
    const target = event.target;

    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLTextAreaElement) &&
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    const name = target.name as PropertyField;

    if (!(name in fieldErrors)) {
      return;
    }

    setFieldErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const errors = validatePropertyForm(form);

    if (Object.keys(errors).length > 0) {
      event.preventDefault();
      setFieldErrors(errors);
      focusFirstError(errors);
      return;
    }

    setFieldErrors({});

    if (mode !== "guest") {
      return;
    }

    event.preventDefault();

    const data = new FormData(form);

    const draft: SavedGuestDraft = {
      name: inputValue(form, "name"),
      universityId: inputValue(form, "universityId"),
      area: inputValue(form, "area"),
      distanceLabel: inputValue(form, "distanceLabel"),
      description: inputValue(form, "description"),
      roomType: inputValue(form, "roomType"),
      annualRent: inputValue(form, "annualRent"),
      totalCount: inputValue(form, "totalCount"),
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
      onSubmit={handleSubmit}
      onInput={handleFormInput}
      noValidate
      className="space-y-8"
    >
      {savedDraft ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          Your saved browser draft has been restored.
        </div>
      ) : null}

      {Object.keys(fieldErrors).length > 0 ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4" role="alert">
          <p className="font-bold text-red-800">
            Please fix {Object.keys(fieldErrors).length === 1 ? "this field" : "the highlighted fields"} before saving.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {Object.values(fieldErrors).map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
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
              aria-invalid={Boolean(fieldErrors.name)}
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-[var(--emerald)] ${
                fieldErrors.name ? "border-red-400 bg-red-50/40" : "border-[var(--border)]"
              }`}
            />
            <ErrorMessage message={fieldErrors.name} />
          </label>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              University
            </label>
            <UniversitySearchSelect
              key={selectedUniversityId || "university-empty"}
              universities={universities}
              name="universityId"
              value={selectedUniversityId}
              valueMode="id"
              required
              ariaInvalid={Boolean(fieldErrors.universityId)}
              onValueChange={(value) => {
                setSelectedUniversityId(value);

                if (value) {
                  setFieldErrors((current) => {
                    const next = { ...current };
                    delete next.universityId;
                    return next;
                  });
                }
              }}
              placeholder="Type the university name..."
              inputClassName={`w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-[var(--emerald)] ${
                fieldErrors.universityId ? "border-red-400 bg-red-50/40" : "border-[var(--border)]"
              }`}
            />
            <ErrorMessage message={fieldErrors.universityId} />
          </div>

          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Area / neighbourhood
            </span>
            <input
              required
              name="area"
              type="text"
              placeholder="e.g. Malete"
              aria-invalid={Boolean(fieldErrors.area)}
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-[var(--emerald)] ${
                fieldErrors.area ? "border-red-400 bg-red-50/40" : "border-[var(--border)]"
              }`}
            />
            <ErrorMessage message={fieldErrors.area} />
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
              aria-invalid={Boolean(fieldErrors.description)}
              className={`w-full resize-y rounded-xl border px-4 py-3 outline-none focus:border-[var(--emerald)] ${
                fieldErrors.description ? "border-red-400 bg-red-50/40" : "border-[var(--border)]"
              }`}
            />
            <ErrorMessage message={fieldErrors.description} />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          First room type
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Room type
            </span>
            <input
              required
              name="roomType"
              type="text"
              placeholder="Self-contained room"
              aria-invalid={Boolean(fieldErrors.roomType)}
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-[var(--emerald)] ${
                fieldErrors.roomType ? "border-red-400 bg-red-50/40" : "border-[var(--border)]"
              }`}
            />
            <ErrorMessage message={fieldErrors.roomType} />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Annual rent (₦)
            </span>
            <input
              required
              min="1"
              step="1"
              name="annualRent"
              type="number"
              placeholder="250000"
              aria-invalid={Boolean(fieldErrors.annualRent)}
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-[var(--emerald)] ${
                fieldErrors.annualRent ? "border-red-400 bg-red-50/40" : "border-[var(--border)]"
              }`}
            />
            <ErrorMessage message={fieldErrors.annualRent} />
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Total rooms
            </span>
            <input
              required
              min="1"
              step="1"
              name="totalCount"
              type="number"
              defaultValue="1"
              aria-invalid={Boolean(fieldErrors.totalCount)}
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-[var(--emerald)] ${
                fieldErrors.totalCount ? "border-red-400 bg-red-50/40" : "border-[var(--border)]"
              }`}
            />
            <ErrorMessage message={fieldErrors.totalCount} />
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
              aria-invalid={Boolean(fieldErrors.availableCount)}
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-[var(--emerald)] ${
                fieldErrors.availableCount ? "border-red-400 bg-red-50/40" : "border-[var(--border)]"
              }`}
            />
            <ErrorMessage message={fieldErrors.availableCount} />
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

        <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-[var(--cream)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Check whether your hostel has all the amenities listed below. If it
            does, use the button to select everything at once instead of
            clicking each amenity one by one.
          </p>

          <button
            type="button"
            onClick={toggleAllAmenities}
            className="shrink-0 rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--forest)]"
          >
            {allAmenitiesSelected ? "Clear all amenities" : "Select all amenities"}
          </button>
        </div>

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
                onChange={syncAllAmenitiesSelected}
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
