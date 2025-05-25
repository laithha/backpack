export interface Backpack {
  id: string;
  name: string;
  brand: string;
  material: string;
  weight: number; 
  color: string;
  manufactureId: number;
  createdAt: Date;
}

export interface manufactures {
    id?: number;
    name?:string;
    country:number;
}
export type BackpackFormData = Omit<Backpack, 'id' | 'createdAt'>; 