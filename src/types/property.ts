export type PropertyAvailability = "available" | "limited";

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
}
