export interface Backpack {
  id: string;
  name: string;
  brand: string;
  material: string;
  weight: number; // weight in grams
  color?: string; // Optional color field
  createdAt: Date;
}

export type BackpackFormData = Omit<Backpack, 'id' | 'createdAt'>; 