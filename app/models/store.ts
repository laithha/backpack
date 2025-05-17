import { Backpack, BackpackFormData } from './types';
import { v4 as uuidv4 } from 'uuid';

// Mock in-memory data store
class BackpackStore {
  private backpacks: Backpack[] = [];

  constructor() {
    // Initialize with some sample data
    this.addBackpack({
      name: 'Explorer 45',
      brand: 'OutdoorTech',
      material: 'Nylon',
      weight: 1200
    });
    this.addBackpack({
      name: 'Day Hiker',
      brand: 'MountainLife',
      material: 'Polyester',
      weight: 850
    });
    this.addBackpack({
      name: 'Urban Commuter',
      brand: 'CityGear',
      material: 'Canvas',
      weight: 700
    });
  }

  // Get all backpacks
  getAll(): Backpack[] {
    return [...this.backpacks];
  }

  // Get a backpack by id
  getById(id: string): Backpack | undefined {
    return this.backpacks.find(backpack => backpack.id === id);
  }

  // Add a new backpack
  addBackpack(data: BackpackFormData): Backpack {
    const newBackpack: Backpack = {
      id: uuidv4(),
      ...data,
      createdAt: new Date()
    };
    this.backpacks.push(newBackpack);
    return newBackpack;
  }

  // Update an existing backpack
  updateBackpack(id: string, data: Partial<BackpackFormData>): Backpack | null {
    const index = this.backpacks.findIndex(backpack => backpack.id === id);
    if (index === -1) return null;
    
    const updatedBackpack = {
      ...this.backpacks[index],
      ...data
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
}

// Create and export a singleton instance
export const backpackStore = new BackpackStore(); 