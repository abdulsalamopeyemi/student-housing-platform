import type { StudentProperty } from "@/types/property";

export const featuredProperties: StudentProperty[] = [
  {
    id: "demo-001",
    slug: "victory-lodge",
    name: "Victory Lodge",
    university: "KWASU",
    area: "Malete",
    roomType: "Self-contained room",
    annualRent: 250000,
    totalRooms: 12,
    availableRooms: 2,
    occupiedRooms: 10,
    availability: "limited",
    facilities: ["Water supply", "Private bathroom", "Near campus"],
    description:
      "A sample self-contained student room used to design how students compare price, facilities, location context, and availability before requesting an inspection.",
    distanceFromCampus: "About 8 minutes from KWASU by bike",
    utilities: ["Water supply", "Electricity connection", "Private bathroom"],
    fees: [
      { label: "Annual rent", amount: 250000, required: true },
      { label: "Agreement / documentation", amount: 15000, required: true },
    ],
    availabilityUpdatedAt: "2026-10-25",
  },
  {
    id: "demo-002",
    slug: "greenview-residence",
    name: "Greenview Residence",
    university: "KWASU",
    area: "Malete",
    roomType: "Single room",
    annualRent: 180000,
    totalRooms: 16,
    availableRooms: 6,
    occupiedRooms: 10,
    availability: "available",
    facilities: ["Water supply", "Security", "Study-friendly area"],
    description:
      "A sample single-room listing for testing a lower-budget accommodation option and the information students need before deciding to inspect.",
    distanceFromCampus: "About 12 minutes from KWASU by bike",
    utilities: ["Water supply", "Shared bathroom", "Compound security"],
    fees: [
      { label: "Annual rent", amount: 180000, required: true },
      { label: "Caution fee", amount: 10000, required: true },
    ],
    availabilityUpdatedAt: "2026-10-25",
  },
  {
    id: "demo-003",
    slug: "harmony-court",
    name: "Harmony Court",
    university: "KWASU",
    area: "Malete",
    roomType: "Self-contained room",
    annualRent: 320000,
    totalRooms: 10,
    availableRooms: 3,
    occupiedRooms: 7,
    availability: "limited",
    facilities: ["Private bathroom", "Kitchen space", "Fenced compound"],
    description:
      "A sample higher-budget self-contained listing used to test richer facility and price-breakdown presentation.",
    distanceFromCampus: "About 10 minutes from KWASU by bike",
    utilities: ["Water supply", "Private bathroom", "Kitchen space"],
    fees: [
      { label: "Annual rent", amount: 320000, required: true },
      { label: "Service / maintenance", amount: 20000, required: true },
    ],
    availabilityUpdatedAt: "2026-10-25",
  },
];

export function getPropertyBySlug(slug: string) {
  return featuredProperties.find((property) => property.slug === slug);
}
