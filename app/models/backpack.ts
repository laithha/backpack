export interface Backpack {
  id: string;
  name: string;
  brand: string;
  material: string;
  weight: number; // weight in grams
  createdAt: Date;
}

export type BackpackFormData = Omit<Backpack, 'id' | 'createdAt'>; 