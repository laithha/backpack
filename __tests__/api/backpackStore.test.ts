import { backpackDb } from '../../app/api/db/backpackStore';

// Reset database before each test
beforeEach(() => {
  backpackDb.resetDatabase();
});

describe('BackpackStore', () => {
  test('getAll should return all backpacks', () => {
    const backpacks = backpackDb.getAll();
    
    // There should be 3 sample backpacks from the reset
    expect(backpacks.length).toBe(3);
    expect(backpacks[0].name).toBe('Explorer 45');
    expect(backpacks[1].name).toBe('Day Hiker');
    expect(backpacks[2].name).toBe('Urban Commuter');
  });
  
  test('getById should return a specific backpack', () => {
    const allBackpacks = backpackDb.getAll();
    const firstId = allBackpacks[0].id;
    
    const backpack = backpackDb.getById(firstId);
    
    expect(backpack).toBeDefined();
    expect(backpack?.name).toBe('Explorer 45');
    expect(backpack?.brand).toBe('OutdoorTech');
  });
  
  test('getById should return undefined for non-existent ID', () => {
    const backpack = backpackDb.getById('non-existent-id');
    
    expect(backpack).toBeUndefined();
  });
  
  test('getFiltered should filter backpacks by brand', () => {
    const filtered = backpackDb.getFiltered({ brand: 'OutdoorTech' });
    
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Explorer 45');
  });
  
  test('getFiltered should handle case-insensitive filtering', () => {
    const filtered = backpackDb.getFiltered({ brand: 'outdoortech' });
    
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Explorer 45');
  });
  
  test('getFiltered should return empty array for no matches', () => {
    const filtered = backpackDb.getFiltered({ brand: 'NonExistentBrand' });
    
    expect(filtered.length).toBe(0);
  });
  
  test('getSorted should sort backpacks by weight', () => {
    const sorted = backpackDb.getSorted('weight', 'asc');
    
    expect(sorted.length).toBe(3);
    expect(sorted[0].name).toBe('Urban Commuter'); // 700g
    expect(sorted[1].name).toBe('Day Hiker');      // 850g
    expect(sorted[2].name).toBe('Explorer 45');    // 1200g
  });
  
  test('getSorted should sort backpacks in descending order', () => {
    const sorted = backpackDb.getSorted('weight', 'desc');
    
    expect(sorted.length).toBe(3);
    expect(sorted[0].name).toBe('Explorer 45');    // 1200g
    expect(sorted[1].name).toBe('Day Hiker');      // 850g
    expect(sorted[2].name).toBe('Urban Commuter'); // 700g
  });
  
  test('addBackpack should add a new backpack', () => {
    const newBackpack = backpackDb.addBackpack({
      name: 'Test Backpack',
      brand: 'Test Brand',
      material: 'Test Material',
      weight: 999,
      color: 'Test Color'
    });
    
    // Check returned backpack has the right properties
    expect(newBackpack.id).toBeDefined();
    expect(newBackpack.name).toBe('Test Backpack');
    expect(newBackpack.createdAt).toBeInstanceOf(Date);
    expect(newBackpack.updatedAt).toBeInstanceOf(Date);
    
    // Check the backpack was actually added
    const allBackpacks = backpackDb.getAll();
    expect(allBackpacks.length).toBe(4);
    
    // Check we can retrieve it by ID
    const retrieved = backpackDb.getById(newBackpack.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Test Backpack');
  });
  
  test('updateBackpack should update an existing backpack', () => {
    const backpacks = backpackDb.getAll();
    const backpackId = backpacks[0].id;
    
    const result = backpackDb.updateBackpack(backpackId, {
      name: 'Updated Name',
      color: 'Updated Color'
    });
    
    // Check returned backpack properties
    expect(result).not.toBeNull();
    expect(result?.name).toBe('Updated Name');
    expect(result?.color).toBe('Updated Color');
    expect(result?.brand).toBe('OutdoorTech'); // Unchanged property
    
    // Check it was actually updated in the database
    const updated = backpackDb.getById(backpackId);
    expect(updated?.name).toBe('Updated Name');
    expect(updated?.color).toBe('Updated Color');
  });
  
  test('updateBackpack should return null for non-existent ID', () => {
    const result = backpackDb.updateBackpack('non-existent-id', {
      name: 'Updated Name'
    });
    
    expect(result).toBeNull();
  });
  
  test('deleteBackpack should delete an existing backpack', () => {
    const backpacks = backpackDb.getAll();
    const backpackId = backpacks[0].id;
    
    const result = backpackDb.deleteBackpack(backpackId);
    
    // Should return true for successful deletion
    expect(result).toBe(true);
    
    // Check it was actually deleted
    const afterDelete = backpackDb.getAll();
    expect(afterDelete.length).toBe(2);
    expect(backpackDb.getById(backpackId)).toBeUndefined();
  });
  
  test('deleteBackpack should return false for non-existent ID', () => {
    const result = backpackDb.deleteBackpack('non-existent-id');
    
    expect(result).toBe(false);
    
    // Should still have all initial backpacks
    const backpacks = backpackDb.getAll();
    expect(backpacks.length).toBe(3);
  });
  
  test('resetDatabase should reset to initial state', () => {
    // Add a new backpack
    backpackDb.addBackpack({
      name: 'Test Backpack',
      brand: 'Test Brand',
      material: 'Test Material',
      weight: 999,
      color: 'Test Color'
    });
    
    // Should now have 4 backpacks
    let backpacks = backpackDb.getAll();
    expect(backpacks.length).toBe(4);
    
    // Reset the database
    backpackDb.resetDatabase();
    
    // Should be back to 3 initial backpacks
    backpacks = backpackDb.getAll();
    expect(backpacks.length).toBe(3);
    expect(backpacks[0].name).toBe('Explorer 45');
    expect(backpacks[1].name).toBe('Day Hiker');
    expect(backpacks[2].name).toBe('Urban Commuter');
  });
}); 
