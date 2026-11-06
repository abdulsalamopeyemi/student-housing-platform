import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/supabase/auth-server";
import { getCurrentProvider } from "@/lib/data/providers";
import { supabaseAuthenticatedRest } from "@/lib/supabase/authenticated-rest";
import { supabasePublicConfig } from "@/lib/supabase/config";
import {
  MAX_PROPERTY_IMAGE_BYTES,
  MAX_PROPERTY_IMAGES,
  PROPERTY_IMAGE_BUCKET,
  propertyImagePublicUrl,
} from "@/lib/property-images";

const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

interface PendingUpload {
  file: File;
  extension: string;
}

async function validateImage(file: File): Promise<PendingUpload | null> {
  const extension = allowedMimeTypes.get(file.type);

  if (
    !extension ||
    file.size <= 0 ||
    file.size > MAX_PROPERTY_IMAGE_BYTES
  ) {
    return null;
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg =
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff;
  const isPng =
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;
  const isWebp =
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";

  const signatureMatches =
    (extension === "jpg" && isJpeg) ||
    (extension === "png" && isPng) ||
    (extension === "webp" && isWebp);

  return signatureMatches ? { file, extension } : null;
}

async function storageRemove(accessToken: string, storagePaths: string[]) {
  if (storagePaths.length === 0) {
    return true;
  }

  const response = await fetch(
    `${supabasePublicConfig.url}/storage/v1/object/${PROPERTY_IMAGE_BUCKET}`,
    {
      method: "DELETE",
      headers: {
        apikey: supabasePublicConfig.publishableKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: storagePaths }),
      cache: "no-store",
    },
  );

  return response.ok;
}

async function getEditableProperty(propertyId: string, providerId: string) {
  const rows = await supabaseAuthenticatedRest<
    Array<{
      id: string;
      name: string;
      publication_status: string;
    }>
  >(
    `properties?id=eq.${encodeURIComponent(
      propertyId,
    )}&provider_id=eq.${encodeURIComponent(
      providerId,
    )}&select=id,name,publication_status&limit=1`,
  );

  const property = rows[0];

  if (!property || !["draft", "rejected"].includes(property.publication_status)) {
    return null;
  }

  return property;
}

export async function POST(request: Request) {
  const [{ user, provider }, accessToken] = await Promise.all([
    getCurrentProvider(),
    getAccessToken(),
  ]);

  if (!user || !provider || !accessToken) {
    return NextResponse.json(
      { error: "Sign in with a property-owner account to upload images." },
      { status: 401 },
    );
  }

  if (provider.provider_type === "agent") {
    return NextResponse.json(
      { error: "Assigned agents cannot change property photos." },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const altText = String(formData.get("altText") ?? "").trim();
  const files = [
    ...formData.getAll("files"),
    ...formData.getAll("file"),
  ].filter((item): item is File => item instanceof File && item.size > 0);

  if (!propertyId || files.length === 0) {
    return NextResponse.json(
      { error: "Choose at least one photo to upload." },
      { status: 400 },
    );
  }

  const property = await getEditableProperty(propertyId, provider.id);

  if (!property) {
    return NextResponse.json(
      {
        error:
          "Photos can only be changed while your own property is a draft or returned for changes.",
      },
      { status: 403 },
    );
  }

  const existing = await supabaseAuthenticatedRest<
    Array<{ id: string; sort_order: number }>
  >(
    `property_images?property_id=eq.${encodeURIComponent(
      propertyId,
    )}&select=id,sort_order&order=sort_order.asc`,
  );

  const remainingSlots = MAX_PROPERTY_IMAGES - existing.length;

  if (files.length > remainingSlots) {
    return NextResponse.json(
      {
        error: `You can add ${remainingSlots} more ${remainingSlots === 1 ? "photo" : "photos"} to this property.`,
      },
      { status: 400 },
    );
  }

  const pendingUploads = await Promise.all(files.map(validateImage));

  if (pendingUploads.some((upload) => upload === null)) {
    return NextResponse.json(
      {
        error:
          "Every photo must be a valid JPEG, PNG or WebP image no larger than 4 MB.",
      },
      { status: 400 },
    );
  }

  const validUploads = pendingUploads as PendingUpload[];
  const storagePaths: string[] = [];
  const nextSortOrder =
    existing.length === 0
      ? 0
      : Math.max(...existing.map((image) => image.sort_order)) + 1;

  try {
    for (const upload of validUploads) {
      const storagePath = `${propertyId}/${randomUUID()}.${upload.extension}`;
      const response = await fetch(
        `${supabasePublicConfig.url}/storage/v1/object/${PROPERTY_IMAGE_BUCKET}/${storagePath}`,
        {
          method: "POST",
          headers: {
            apikey: supabasePublicConfig.publishableKey,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": upload.file.type,
            "cache-control": "3600",
            "x-upsert": "false",
          },
          body: upload.file,
          cache: "no-store",
        },
      );

      if (!response.ok) {
        await storageRemove(accessToken, storagePaths);
        return NextResponse.json(
          {
            error:
              "One of the photos could not be uploaded. Check your connection and try again.",
          },
          { status: response.status },
        );
      }

      storagePaths.push(storagePath);
    }

    const metadata = await supabaseAuthenticatedRest<
      Array<{
        id: string;
        storage_path: string;
        alt_text: string;
        sort_order: number;
        created_at: string;
      }>
    >("property_images?select=id,storage_path,alt_text,sort_order,created_at", {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify(
        storagePaths.map((storagePath, index) => ({
          property_id: propertyId,
          storage_path: storagePath,
          alt_text:
            altText || `${property.name} accommodation photo ${index + 1}`,
          sort_order: nextSortOrder + index,
        })),
      ),
    });

    if (metadata.length !== storagePaths.length) {
      await storageRemove(accessToken, storagePaths);
      return NextResponse.json(
        { error: "The photo details could not be saved. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      images: metadata.map((image) => ({
        ...image,
        url: propertyImagePublicUrl(image.storage_path),
      })),
    });
  } catch {
    await storageRemove(accessToken, storagePaths);

    return NextResponse.json(
      { error: "The photos could not be saved. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const [{ user, provider }, accessToken] = await Promise.all([
    getCurrentProvider(),
    getAccessToken(),
  ]);

  if (!user || !provider || !accessToken) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (provider.provider_type === "agent") {
    return NextResponse.json(
      { error: "Assigned agents cannot change property photos." },
      { status: 403 },
    );
  }

  const payload = (await request.json()) as {
    propertyId?: string;
    imageId?: string;
  };

  const propertyId = payload.propertyId?.trim() ?? "";
  const imageId = payload.imageId?.trim() ?? "";

  if (!propertyId || !imageId) {
    return NextResponse.json(
      { error: "Property image could not be identified." },
      { status: 400 },
    );
  }

  const property = await getEditableProperty(propertyId, provider.id);

  if (!property) {
    return NextResponse.json(
      { error: "You cannot change photos for this property right now." },
      { status: 403 },
    );
  }

  const rows = await supabaseAuthenticatedRest<
    Array<{ id: string; storage_path: string }>
  >(
    `property_images?id=eq.${encodeURIComponent(
      imageId,
    )}&property_id=eq.${encodeURIComponent(
      propertyId,
    )}&select=id,storage_path&limit=1`,
  );

  const image = rows[0];

  if (!image) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  const removed = await storageRemove(accessToken, [image.storage_path]);

  if (!removed) {
    return NextResponse.json(
      { error: "The stored image could not be removed." },
      { status: 500 },
    );
  }

  await supabaseAuthenticatedRest(
    `property_images?id=eq.${encodeURIComponent(
      imageId,
    )}&property_id=eq.${encodeURIComponent(propertyId)}`,
    { method: "DELETE" },
  );

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const { user, provider } = await getCurrentProvider();

  if (!user || !provider) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (provider.provider_type === "agent") {
    return NextResponse.json(
      { error: "Assigned agents cannot change property photos." },
      { status: 403 },
    );
  }

  const payload = (await request.json()) as {
    propertyId?: string;
    imageId?: string;
  };

  const propertyId = payload.propertyId?.trim() ?? "";
  const imageId = payload.imageId?.trim() ?? "";

  if (!propertyId || !imageId) {
    return NextResponse.json(
      { error: "Choose an image to use as the cover." },
      { status: 400 },
    );
  }

  const property = await getEditableProperty(propertyId, provider.id);

  if (!property) {
    return NextResponse.json(
      { error: "You cannot change photos for this property right now." },
      { status: 403 },
    );
  }

  const images = await supabaseAuthenticatedRest<
    Array<{ id: string; sort_order: number }>
  >(
    `property_images?property_id=eq.${encodeURIComponent(
      propertyId,
    )}&select=id,sort_order&order=sort_order.asc`,
  );

  if (!images.some((image) => image.id === imageId)) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  const ordered = [
    images.find((image) => image.id === imageId)!,
    ...images.filter((image) => image.id !== imageId),
  ];

  await Promise.all(
    ordered.map((image, index) =>
      supabaseAuthenticatedRest(
        `property_images?id=eq.${encodeURIComponent(image.id)}`,
        {
          method: "PATCH",
          prefer: "return=minimal",
          body: JSON.stringify({ sort_order: index }),
        },
      ),
    ),
  );

  return NextResponse.json({ ok: true });
}
