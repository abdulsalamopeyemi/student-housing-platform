import "server-only";

import { supabasePublicRest } from "@/lib/supabase/public-rest";
import { propertyImagePublicUrl } from "@/lib/property-images";
import type { StudentProperty } from "@/types/property";

interface PublicPropertyRow {
  id: string;
  slug: string;
  name: string;
  area: string;
  description: string;
  distance_label: string | null;
  verification_status: "verified";
  universities: {
    name: string;
  } | null;
  room_types: Array<{
    id: string;
    name: string;
    annual_rent: number;
    total_count: number;
    available_count: number;
    availability_updated_at: string;
    property_fees: Array<{
      label: string;
      amount: number;
      required: boolean;
    }>;
  }>;
  property_images: Array<{
    id: string;
    storage_path: string;
    alt_text: string;
    sort_order: number;
  }>;
  property_amenities: Array<{
    amenities: {
      name: string;
    } | null;
  }>;
}

function mapProperty(row: PublicPropertyRow): StudentProperty | null {
  const roomType = row.room_types[0];

  if (!roomType) {
    return null;
  }

  const facilities = row.property_amenities
    .map((item) => item.amenities?.name)
    .filter((name): name is string => Boolean(name));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    university: row.universities?.name ?? "University not specified",
    area: row.area,
    roomType: roomType.name,
    annualRent: Number(roomType.annual_rent),
    totalRooms: roomType.total_count,
    availableRooms: roomType.available_count,
    occupiedRooms: Math.max(0, roomType.total_count - roomType.available_count),
    availability:
      roomType.available_count === 0
        ? "occupied"
        : roomType.available_count <= 3
          ? "limited"
          : "available",
    images: [...row.property_images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({
        id: image.id,
        url: propertyImagePublicUrl(image.storage_path),
        altText: image.alt_text,
        sortOrder: image.sort_order,
      })),
    facilities,
    description: row.description,
    distanceFromCampus: row.distance_label ?? "Distance not provided",
    utilities: [],
    fees: [
      {
        label: "Annual rent",
        amount: Number(roomType.annual_rent),
        required: true,
      },
      ...roomType.property_fees.map((fee) => ({
        label: fee.label,
        amount: Number(fee.amount),
        required: fee.required,
      })),
    ],
    availabilityUpdatedAt: roomType.availability_updated_at,
    verified: row.verification_status === "verified",
  };
}

const PUBLIC_PROPERTY_SELECT =
  "id,slug,name,area,description,distance_label,verification_status,universities(name),room_types(id,name,annual_rent,total_count,available_count,availability_updated_at,property_fees(label,amount,required)),property_images(id,storage_path,alt_text,sort_order),property_amenities(amenities(name))";

export async function getPublishedProperties() {
  const rows = await supabasePublicRest<PublicPropertyRow[]>(
    `properties?publication_status=eq.published&verification_status=eq.verified&select=${PUBLIC_PROPERTY_SELECT}&order=published_at.desc`,
    { cache: "no-store" },
  );

  return rows.map(mapProperty).filter((property): property is StudentProperty => Boolean(property));
}

export async function getPublishedPropertyBySlug(slug: string) {
  const rows = await supabasePublicRest<PublicPropertyRow[]>(
    `properties?slug=eq.${encodeURIComponent(slug)}&publication_status=eq.published&verification_status=eq.verified&select=${PUBLIC_PROPERTY_SELECT}&limit=1`,
    { cache: "no-store" },
  );

  return rows[0] ? mapProperty(rows[0]) : null;
}
