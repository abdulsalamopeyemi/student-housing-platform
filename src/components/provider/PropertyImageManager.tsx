"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import {
  MAX_PROPERTY_IMAGE_BYTES,
  MAX_PROPERTY_IMAGES,
} from "@/lib/property-images";

export interface ManagedPropertyImage {
  id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
  url: string;
}

interface PropertyImageManagerProps {
  propertyId: string;
  propertyName: string;
  propertySlug: string;
  publicationStatus: string;
  initialImages: ManagedPropertyImage[];
}

export default function PropertyImageManager({
  propertyId,
  propertyName,
  propertySlug,
  publicationStatus,
  initialImages,
}: PropertyImageManagerProps) {
  const [images, setImages] = useState(
    [...initialImages].sort((a, b) => a.sort_order - b.sort_order),
  );
  const [altText, setAltText] = useState("");
  const [selectedFileCount, setSelectedFileCount] = useState(0);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canEdit = ["draft", "rejected"].includes(publicationStatus);
  const remainingSlots = Math.max(0, MAX_PROPERTY_IMAGES - images.length);
  const coverImage = images[0] ?? null;

  const helperText = useMemo(() => {
    if (!canEdit) {
      return "Photos are locked while this listing is under review or already published.";
    }

    if (remainingSlots === 0) {
      return "You have reached the 8-photo limit.";
    }

    return `${remainingSlots} photo ${remainingSlots === 1 ? "slot" : "slots"} remaining.`;
  }, [canEdit, remainingSlots]);

  async function uploadImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const files = Array.from(fileInputRef.current?.files ?? []);

    if (files.length === 0) {
      setIsError(true);
      setMessage("Choose at least one photo first.");
      return;
    }

    if (files.length > remainingSlots) {
      setIsError(true);
      setMessage(`You can add only ${remainingSlots} more ${remainingSlots === 1 ? "photo" : "photos"}.`);
      return;
    }

    if (files.some((file) => file.size > MAX_PROPERTY_IMAGE_BYTES)) {
      setIsError(true);
      setMessage("Each image must be 4 MB or smaller.");
      return;
    }

    setIsBusy(true);
    setMessage("");

    const payload = new FormData();
    payload.set("propertyId", propertyId);
    payload.set("altText", altText);
    files.forEach((file) => payload.append("files", file));

    try {
      const response = await fetch("/api/provider/property-images", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as {
        images?: ManagedPropertyImage[];
        error?: string;
      };

      if (!response.ok || !result.images?.length) {
        throw new Error(result.error ?? "The photos could not be uploaded.");
      }

      setImages((current) =>
        [...current, ...result.images!].sort(
          (a, b) => a.sort_order - b.sort_order,
        ),
      );
      setAltText("");
      setSelectedFileCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsError(false);
      setMessage(
        images.length === 0
          ? `${result.images.length} ${result.images.length === 1 ? "photo" : "photos"} uploaded. The first is now the cover.`
          : `${result.images.length} ${result.images.length === 1 ? "photo" : "photos"} uploaded.`,
      );
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "The photos could not be uploaded.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function removeImage(imageId: string) {
    setIsBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/provider/property-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, imageId }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "The photo could not be removed.");
      }

      setImages((current) => {
        const next = current
          .filter((image) => image.id !== imageId)
          .map((image, index) => ({ ...image, sort_order: index }));
        return next;
      });
      setIsError(false);
      setMessage("Photo removed.");
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "The photo could not be removed.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function makeCover(imageId: string) {
    setIsBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/provider/property-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, imageId }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "The cover photo could not be changed.");
      }

      setImages((current) => {
        const selected = current.find((image) => image.id === imageId);

        if (!selected) {
          return current;
        }

        return [
          { ...selected, sort_order: 0 },
          ...current
            .filter((image) => image.id !== imageId)
            .map((image, index) => ({ ...image, sort_order: index + 1 })),
        ];
      });
      setIsError(false);
      setMessage("Cover photo updated.");
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "The cover photo could not be changed.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
          Upload property photos
        </p>
        <h2 className="mt-3 text-2xl font-bold text-[var(--forest)]">
          Show students what they are considering.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Use clear, recent photos of the room, bathroom, compound and important
          shared spaces. The first photo becomes the cover image students see
          while browsing.
        </p>

        <div className="mt-5 rounded-2xl bg-[var(--cream)] p-4 text-sm leading-6 text-[var(--muted)]">
          <p>• Up to {MAX_PROPERTY_IMAGES} photos.</p>
          <p>• JPEG, PNG or WebP.</p>
          <p>• Maximum 4 MB per image.</p>
          <p>• Avoid screenshots, watermarks or misleading photos.</p>
        </div>

        <form onSubmit={uploadImage} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Photos
            </span>
            <input
              ref={fileInputRef}
              required
              multiple
              disabled={!canEdit || remainingSlots === 0 || isBusy}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setSelectedFileCount(event.target.files?.length ?? 0)
              }
              className="block w-full rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm text-[var(--muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--cream)] file:px-3 file:py-2 file:font-semibold file:text-[var(--forest)]"
            />
            {selectedFileCount > 0 ? (
              <span className="mt-2 block text-xs font-semibold text-[var(--emerald)]">
                {selectedFileCount} {selectedFileCount === 1 ? "photo" : "photos"} selected
              </span>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
              Photo description (optional)
            </span>
            <input
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              disabled={!canEdit || isBusy}
              maxLength={160}
              type="text"
              placeholder="e.g. Self-contained room with private bathroom"
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--emerald)]"
            />
          </label>

          <button
            disabled={!canEdit || remainingSlots === 0 || isBusy}
            className="w-full rounded-xl bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--emerald)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBusy
              ? "Uploading…"
              : selectedFileCount > 1
                ? `Upload ${selectedFileCount} photos`
                : "Upload photo"}
          </button>
        </form>

        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          {helperText}
        </p>

        {message ? (
          <p
            role={isError ? "alert" : "status"}
            className={[
              "mt-4 rounded-xl px-4 py-3 text-sm font-medium",
              isError
                ? "bg-red-50 text-red-800"
                : "bg-emerald-50 text-emerald-900",
            ].join(" ")}
          >
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/list-property"
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--forest)]"
          >
            Back to workspace
          </Link>
          {publicationStatus === "published" ? (
            <Link
              href={`/properties/${propertySlug}`}
              className="rounded-xl bg-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              View public listing
            </Link>
          ) : null}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--emerald)]">
              Property gallery
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--forest)]">
              {propertyName}
            </h2>
          </div>
          <p className="text-sm font-semibold text-[var(--muted)]">
            {images.length}/{MAX_PROPERTY_IMAGES}
          </p>
        </div>

        {images.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-[var(--forest)]">
              No photos yet.
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
              Add at least one clear photo before submitting the property for
              review. A strong listing should show the actual accommodation,
              not a generic stock image.
            </p>
          </div>
        ) : (
          <>
            {coverImage ? (
              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--cream)]">
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt_text || `${propertyName} cover photo`}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[var(--forest)]">
                  Cover photo
                </span>
              </div>
            ) : null}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {images.map((image, index) => (
                <article
                  key={image.id}
                  className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white"
                >
                  <div className="relative aspect-[4/3] bg-[var(--cream)]">
                    <Image
                      src={image.url}
                      alt={image.alt_text || `${propertyName} photo ${index + 1}`}
                      fill
                      sizes="(min-width: 1024px) 27vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="min-h-10 text-sm leading-5 text-[var(--muted)]">
                      {image.alt_text || `Property photo ${index + 1}`}
                    </p>
                    {canEdit ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {index !== 0 ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => makeCover(image.id)}
                            className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--forest)]"
                          >
                            Make cover
                          </button>
                        ) : null}
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => removeImage(image.id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
