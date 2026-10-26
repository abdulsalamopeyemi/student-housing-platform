export type PropertyAvailability = "available" | "limited" | "occupied";

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
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  availability: PropertyAvailability;
  facilities: string[];
  description: string;
  distanceFromCampus: string;
  utilities: string[];
  fees: PropertyFee[];
  availabilityUpdatedAt: string;
  verified?: boolean;
}
