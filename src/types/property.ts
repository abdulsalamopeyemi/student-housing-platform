export type PropertyAvailability = "available" | "limited" | "occupied";

export interface PropertyFee {
  label: string;
  amount: number;
  required: boolean;
}

export interface StudentPropertyImage {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
}

export interface StudentProperty {
  id: string;
  slug: string;
  name: string;
  university: string;
  area: string;
  roomType: string;
  annualRent: number;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  availability: PropertyAvailability;
  images: StudentPropertyImage[];
  facilities: string[];
  description: string;
  distanceFromCampus: string;
  utilities: string[];
  fees: PropertyFee[];
  availabilityUpdatedAt: string;
  verified?: boolean;
}
