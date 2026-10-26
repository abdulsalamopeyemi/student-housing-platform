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

  if (!property) {
    return null;
  }

  if (!["draft", "rejected"].includes(property.publication_status)) {
    return null;
  }

  return property;
}

async function storageRemove(accessToken: string, storagePath: string) {
  return fetch(
    `${supabasePublicConfig.url}/storage/v1/object/${PROPERTY_IMAGE_BUCKET}`,
    {
      method: "DELETE",
      headers: {
        apikey: supabasePublicConfig.publishableKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: [storagePath] }),
      cache: "no-store",
    },
  );
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
  const file = formData.get("file");

  if (!propertyId || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Choose an image to upload." },
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

  const extension = allowedMimeTypes.get(file.type);

  if (!extension) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG, or WebP image." },
      { status: 400 },
    );
  }

  if (file.size <= 0 || file.size > MAX_PROPERTY_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Each image must be 4 MB or smaller." },
      { status: 400 },
    );
  }

  const existing = await supabaseAuthenticatedRest<
    Array<{ id: string; sort_order: number }>
  >(
    `property_images?property_id=eq.${encodeURIComponent(
      propertyId,
    )}&select=id,sort_order&order=sort_order.asc`,
  );

  if (existing.length >= MAX_PROPERTY_IMAGES) {
    return NextResponse.json(
      { error: `You can upload up to ${MAX_PROPERTY_IMAGES} property images.` },
      { status: 400 },
    );
  }

  const storagePath = `${propertyId}/${randomUUID()}.${extension}`;
  const uploadResponse = await fetch(
    `${supabasePublicConfig.url}/storage/v1/object/${PROPERTY_IMAGE_BUCKET}/${storagePath}`,
    {
      method: "POST",
      headers: {
        apikey: supabasePublicConfig.publishableKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": file.type,
        "cache-control": "3600",
        "x-upsert": "false",
      },
      body: new Uint8Array(await file.arrayBuffer()),
      cache: "no-store",
    },
  );

  if (!uploadResponse.ok) {
    return NextResponse.json(
      {
        error: "The image could not be uploaded. Please try another image.",
      },
      { status: uploadResponse.status },
    );
  }

  const nextSortOrder =
    existing.length === 0
      ? 0
      : Math.max(...existing.map((image) => image.sort_order)) + 1;

  try {
    const rows = await supabaseAuthenticatedRest<
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
      body: JSON.stringify({
        property_id: propertyId,
        storage_path: storagePath,
        alt_text:
          altText || `${property.name} accommodation photo`,
        sort_order: nextSortOrder,
      }),
    });

    const image = rows[0];

    if (!image) {
      await storageRemove(accessToken, storagePath);
      return NextResponse.json(
        { error: "The photo metadata could not be saved." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      image: {
        ...image,
        url: propertyImagePublicUrl(image.storage_path),
      },
    });
  } catch {
    await storageRemove(accessToken, storagePath);

    return NextResponse.json(
      { error: "The photo metadata could not be saved." },
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

  const removeResponse = await storageRemove(accessToken, image.storage_path);

  if (!removeResponse.ok) {
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
