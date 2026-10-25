export type PropertyAvailability = "available" | "limited";

export interface PropertyFee {
  label: string;
  amount: number;
  required: boolean;
}

export interface StudentProperty {
  id: string;
  slug: string;
  name: string;
  university: string;
  area: string;
  roomType: string;
  annualRent: number;
  availableRooms: number;
  availability: PropertyAvailability;
  facilities: string[];
  description: string;
  distanceFromCampus: string;
  utilities: string[];
  fees: PropertyFee[];
  availabilityUpdatedAt: string;
}
