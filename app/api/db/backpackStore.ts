import { BackpackSchemaType } from '../models/backpackSchema';

// Interface for a backpack with ID and timestamps
export interface Backpack extends BackpackSchemaType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory database for backpacks
class BackpackDatabase {
  private backpacks: Backpack[] = [];
  private nextId: number = 1; // Track the next ID to use

  constructor() {
    // Initialize with some sample data
    this.addBackpack({
      name: "Explorer 45",
      brand: "OutdoorTech",
      material: "Nylon",
      weight: 1200,
      color: "Blue"
    });
    this.addBackpack({
      name: "Day Hiker",
      brand: "MountainLife",
      material: "Polyester",
      weight: 850,
      color: "Red"
    });
    this.addBackpack({
      name: "Urban Commuter",
      brand: "CityGear",
      material: "Canvas",
      weight: 700,
      color: "Black"
    });
  }

  // Get all backpacks
  getAll(): Backpack[] {
    return [...this.backpacks];
  }

  // Get filtered backpacks
  getFiltered(filter: Partial<Backpack>): Backpack[] {
    return this.backpacks.filter(backpack => {
      return Object.entries(filter).every(([key, value]) => {
        if (typeof value === 'string') {
          return String(backpack[key as keyof Backpack]).toLowerCase().includes(value.toLowerCase());
        }
        return backpack[key as keyof Backpack] === value;
      });
    });
  }

  // Get sorted backpacks
  getSorted(sortBy: keyof Backpack, order: 'asc' | 'desc'): Backpack[] {
    return [...this.backpacks].sort((a, b) => {
      let comparison = 0;
      if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
        comparison = (a[sortBy] as string).localeCompare(b[sortBy] as string);
      } else {
        const valA = a[sortBy];
        const valB = b[sortBy];
        comparison = valA !== undefined && valB !== undefined 
          ? (valA > valB ? 1 : valA < valB ? -1 : 0)
          : 0;
      }
      return order === 'asc' ? comparison : -comparison;
    });
  }

  // Get a backpack by ID
  getById(id: string): Backpack | undefined {
    return this.backpacks.find(backpack => backpack.id === id);
  }

  // Add a new backpack
  addBackpack(data: BackpackSchemaType): Backpack {
    const newBackpack: Backpack = {
      id: this.nextId.toString(), // Use string representation of sequential number
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.backpacks.push(newBackpack);
    this.nextId++; // Increment ID for next backpack
    return newBackpack;
  }

  // Update an existing backpack
  updateBackpack(id: string, data: Partial<BackpackSchemaType>): Backpack | null {
    const index = this.backpacks.findIndex(backpack => backpack.id === id);
    if (index === -1) return null;
    
    const updatedBackpack = {
      ...this.backpacks[index],
      ...data,
      updatedAt: new Date()
    };
    
    this.backpacks[index] = updatedBackpack;
    return updatedBackpack;
  }

  // Delete a backpack
  deleteBackpack(id: string): boolean {
    const initialLength = this.backpacks.length;
    this.backpacks = this.backpacks.filter(backpack => backpack.id !== id);
    return this.backpacks.length < initialLength;
  }

  // Reset the database (for testing purposes)
  resetDatabase() {
    this.backpacks = [];
    this.nextId = 1;
    
    // Re-add sample data
    this.addBackpack({
      name: "Explorer 45",
      brand: "OutdoorTech",
      material: "Nylon",
      weight: 1200,
      color: "Blue"
    });
    this.addBackpack({
      name: "Day Hiker",
      brand: "MountainLife",
      material: "Polyester",
      weight: 850,
      color: "Red"
    });
    this.addBackpack({
      name: "Urban Commuter",
      brand: "CityGear",
      material: "Canvas",
      weight: 700,
      color: "Black"
    });
  }
}

// Create and export a singleton instance
export const backpackDb = new BackpackDatabase(); 