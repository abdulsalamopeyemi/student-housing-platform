"use client";

import { useState } from "react";

import { updatePropertyDraft } from "@/app/provider/properties/edit-actions";
import UniversitySearchSelect from "@/components/forms/UniversitySearchSelect";
import type { Amenity } from "@/lib/data/amenities";
import type { EditableProviderProperty } from "@/lib/data/provider-properties";
import type { University } from "@/lib/data/universities";

interface PropertyEditFormProps {
  property: EditableProviderProperty;
  universities: University[];
  amenities: Amenity[];
}

interface FeeRow {
  key: string;
  label: string;
  amount: number | "";
}

export default function PropertyEditForm({
  property,
  universities,
  amenities,
}: PropertyEditFormProps) {
  const room = property.room_types[0];
  const [selectedUniversityId, setSelectedUniversityId] = useState(
    property.university_id,
  );
  const [feeRows, setFeeRows] = useState<FeeRow[]>(
    room?.property_fees.length
      ? room.property_fees.map((fee) => ({
          key: fee.id,
          label: fee.label,
          amount: Number(fee.amount),
        }))
      : [{ key: "fee-0", label: "", amount: "" }],
  );
  const selectedAmenities = new Set(
    property.property_amenities.map((item) => item.amenity_id),
  );

  function addFeeRow() {
    setFeeRows((rows) => [
      ...rows,
      {
        key: `fee-${rows.length}-${Date.now()}`,
        label: "",
        amount: "",
      },
    ]);
  }

  function removeFeeRow(key: string) {
    setFeeRows((rows) => {
      const next = rows.filter((row) => row.key !== key);
      return next.length > 0
        ? next
        : [{ key: "fee-empty", label: "", amount: "" }];
    });
  }

  return (
    <form action={updatePropertyDraft} className="space-y-8">
      <input type="hidden" name="propertyId" value={property.id} />

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
              Property basics
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--forest)]">
              Edit listing details
            </h2>
          </div>
          <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold capitalize text-[var(--forest)]">
            {property.publication_status.replaceAll("_", " ")}
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Property name
            </span>
            <input
              required
              minLength={3}
              name="name"
              type="text"
              defaultValue={property.name}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              University
            </label>
            <UniversitySearchSelect
              key={selectedUniversityId}
              universities={universities}
              name="universityId"
              value={selectedUniversityId}
              valueMode="id"
              required
              onValueChange={setSelectedUniversityId}
              placeholder="Type the university name..."
              inputClassName="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </div>

          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Area / neighbourhood
            </span>
            <input
              required
              minLength={2}
              name="area"
              type="text"
              defaultValue={property.area}
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
              defaultValue={property.distance_label ?? ""}
              placeholder="e.g. About 8 minutes from campus by bike"
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
              rows={6}
              defaultValue={property.description}
              className="w-full resize-y rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Room and availability
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Keep these figures accurate. Students see total, available and occupied
          rooms on the public listing.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Room type
            </span>
            <input
              required
              minLength={2}
              name="roomType"
              type="text"
              defaultValue={room?.name ?? ""}
              placeholder="Self-contained"
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
              step="1"
              name="annualRent"
              type="number"
              defaultValue={room ? Number(room.annual_rent) : ""}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
            />
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
              defaultValue={room?.total_count ?? 1}
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
              defaultValue={room?.available_count ?? 0}
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
              Keep every mandatory cost visible to students before they decide.
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
          {feeRows.map((fee) => (
            <div
              key={fee.key}
              className="grid gap-3 sm:grid-cols-[1fr_0.55fr_auto]"
            >
              <input
                name="feeLabel"
                type="text"
                defaultValue={fee.label}
                placeholder="e.g. Agreement / documentation"
                className="rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
              />
              <input
                min="0"
                step="500"
                name="feeAmount"
                type="number"
                defaultValue={fee.amount}
                placeholder="15000"
                className="rounded-xl border border-[var(--border)] px-4 py-3 outline-none focus:border-[var(--emerald)]"
              />
              <button
                type="button"
                onClick={() => removeFeeRow(fee.key)}
                className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Facilities and amenities
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Select only facilities that are genuinely available at the property.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity) => (
            <label
              key={amenity.id}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] p-4"
            >
              <input
                type="checkbox"
                name="amenities"
                value={amenity.id}
                defaultChecked={selectedAmenities.has(amenity.id)}
                className="mt-1"
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

      <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white/95 p-4 shadow-xl shadow-black/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-[var(--muted)]">
          Save your changes, review your photos, then resubmit when the listing
          is ready.
        </p>
        <button className="rounded-xl bg-[var(--forest)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--emerald)]">
          Save changes
        </button>
      </div>
    </form>
  );
}
