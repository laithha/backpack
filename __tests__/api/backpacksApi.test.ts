import { NextRequest, NextResponse } from 'next/server';
import { GET as getAll, POST as createBackpack } from '../../app/api/backpacks/route';
import { GET as getById, PATCH as updateBackpack, DELETE as deleteBackpack } from '../../app/api/backpacks/[id]/route';
import { GET as filterBackpacks } from '../../app/api/backpacks/';
import { GET as sortBackpacks } from '../../app/api/backpacks/sort/route';
import { backpackDb } from '../../app/api/db/backpackStore';
import { createMockRequest } from '../../src/test-utils';
import test, { beforeEach, describe } from 'node:test';

beforeEach(() => {
  backpackDb.resetDatabase();
});

describe('Backpacks API', () => {
  describe('GET /api/backpacks', () => {
    test('should return all backpacks', async () => {
      const req = createMockRequest({ 
        method: 'GET',
        url: 'http://localhost:3000/api/backpacks' 
      });
      const response = await getAll(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(3);
    });
    
    test('should filter backpacks by brand', async () => {
      const req = createMockRequest({ 
        method: 'GET',
        url: 'http://localhost:3000/api/backpacks?brand=OutdoorTech' 
      });
      
      const response = await getAll(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0].brand).toBe('OutdoorTech');
    });
    
    test('should sort backpacks by weight', async () => {
      const req = createMockRequest({ 
        method: 'GET',
        url: 'http://localhost:3000/api/backpacks?sortBy=weight&order=asc' 
      });
      
      const response = await getAll(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.length).toBe(3);
      expect(data[0].name).toBe('Urban Commuter'); // Lightest
      expect(data[2].name).toBe('Explorer 45');    // Heaviest
    });
  });
  
  // Test POST /api/backpacks
  describe('POST /api/backpacks', () => {
    test('should create a new backpack', async () => {
      const req = createMockRequest({ 
        method: 'POST',
        url: 'http://localhost:3000/api/backpacks',
        body: {
          name: 'Test Backpack',
          brand: 'Test Brand',
          material: 'Test Material',
          weight: 500,
          color: 'Blue'
        }
      });
      
      const response = await createBackpack(req);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.id).toBeDefined();
      expect(data.name).toBe('Test Backpack');
      const allBackpacks = backpackDb.getAll();
      expect(allBackpacks.length).toBe(4);
    });
    
    test('should return validation error for invalid input', async () => {
      const req = createMockRequest({ 
        method: 'POST',
        url: 'http://localhost:3000/api/backpacks',
        body: {
          name: 'Te',
          material: 'Test Material'
        }
      });
      const response = await createBackpack(req);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
      // Should not have added a backpack
      const allBackpacks = backpackDb.getAll();
      expect(allBackpacks.length).toBe(4);
    });
  });
  
  // Test GET /api/backpacks/[id]
  describe('GET /api/backpacks/[id]', () => {
    test('should return a specific backpack by ID', async () => {
      const backpacks = backpackDb.getAll();
      const backpackId = backpacks[0].id;
      
      const req = createMockRequest({ 
        method: 'GET',
        url: `http://localhost:3000/api/backpacks/${backpackId}`
      });
      
      const response = await getById(req, { params: { id: backpackId } });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.id).toBe(backpackId);
      expect(data.name).toBe('Explorer 45');
    });
    
    test('should return 404 for non-existent backpack', async () => {
      const req = createMockRequest({ 
        method: 'GET',
        url: 'http://localhost:3000/api/backpacks/non-existent-id'
      });
      
      const response = await getById(req, { params: { id: 'non-existent-id' } });
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.error).toBe('Backpack not found');
    });
  });
  
  // Test PATCH /api/backpacks/[id]
  describe('PATCH /api/backpacks/[id]', () => {
    test('should update an existing backpack', async () => {
      const backpacks = backpackDb.getAll();
      const backpackId = backpacks[0].id;
      
      const req = createMockRequest({ 
        method: 'PATCH',
        url: `http://localhost:3000/api/backpacks/${backpackId}`,
        body: {
          name: 'Updated Backpack',
          color: 'Yellow'
        }
      });
      
      const response = await updateBackpack(req, { params: { id: backpackId } });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.name).toBe('Updated Backpack');
      expect(data.color).toBe('Yellow');
      expect(data.brand).toBe('OutdoorTech'); // Should preserve existing values
      
      // Check it was updated in the database
      const updated = backpackDb.getById(backpackId);
      expect(updated?.name).toBe('Updated Backpack');
    });
    
    test('should return 404 for non-existent backpack', async () => {
      const req = createMockRequest({ 
        method: 'PATCH',
        url: 'http://localhost:3000/api/backpacks/non-existent-id',
        body: {
          name: 'Will Not Update'
        }
      });
      
      const response = await updateBackpack(req, { params: { id: 'non-existent-id' } });
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.error).toBe('Backpack not found');
    });
    
    test('should return validation error for invalid data', async () => {
      const backpacks = backpackDb.getAll();
      const backpackId = backpacks[0].id;
      
      const req = createMockRequest({ 
        method: 'PATCH',
        url: `http://localhost:3000/api/backpacks/${backpackId}`,
        body: {
          name: 'Ab',  // Too short
          weight: 'not-a-number'  // Invalid weight
        }
      });
      
      const response = await updateBackpack(req, { params: { id: backpackId } });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
      
      // Should not have updated the backpack
      const unchanged = backpackDb.getById(backpackId);
      expect(unchanged?.name).toBe('Updated Backpack');
    });
  });
  
  // Test DELETE /api/backpacks/[id]
  describe('DELETE /api/backpacks/[id]', () => {
    test('should delete an existing backpack', async () => {
      const backpacks = backpackDb.getAll();
      const backpackId = backpacks[0].id;
      
      const req = createMockRequest({ 
        method: 'DELETE',
        url: `http://localhost:3000/api/backpacks/${backpackId}`
      });
      
      const response = await deleteBackpack(req, { params: { id: backpackId } });
      
      expect(response.status).toBe(204);
      
      const allBackpacks = backpackDb.getAll();
      expect(allBackpacks.length).toBe(3);
      expect(backpackDb.getById(backpackId)).toBeUndefined();
    });
    
    test('should return 404 for non-existent backpack', async () => {
      const req = createMockRequest({ 
        method: 'DELETE',
        url: 'http://localhost:3000/api/backpacks/non-existent-id'
      });
      
      const response = await deleteBackpack(req, { params: { id: 'non-existent-id' } });
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.error).toBe('Backpack not found');
    });
  });

  // Test filter API
  describe('GET /api/backpacks/filter', () => {
    test('should filter backpacks by brand', async () => {
      const req = createMockRequest({ 
        method: 'GET',
        url: 'http://localhost:3000/api/backpacks/filter?brand=OutdoorTech' 
      });
      
      const response = await filterBackpacks(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0].brand).toBe('OutdoorTech');
    });
    
    test('should filter backpacks by multiple criteria', async () => {
      const req = createMockRequest({ 
        method: 'GET',
        url: 'http://localhost:3000/api/backpacks/filter?material=Canvas&color=Black' 
      });
      
      const response = await filterBackpacks(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.length).toBe(1);
      expect(data[0].name).toBe('Urban Commuter');
      expect(data[0].material).toBe('Canvas');
      expect(data[0].color).toBe('Black');
    });
  });
  
  // Test sort API
  describe('GET /api/backpacks/sort', () => {
    test('should sort backpacks by weight in ascending order', async () => {
      const req = createMockRequest({ 
        method: 'GET',
        url: 'http://localhost:3000/api/backpacks/sort?sortBy=weight&order=asc' 
      });
      
      const response = await sortBackpacks(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.length).toBe(3);
      expect(data[0].name).toBe('Urban Commuter'); // Lightest
      expect(data[2].name).toBe('Explorer 45');    // Heaviest
    });
    
    test('should sort backpacks by name in descending order', async () => {
      const req = createMockRequest({ 
        method: 'GET',
        url: 'http://localhost:3000/api/backpacks/sort?sortBy=name&order=desc' 
      });
      
      const response = await sortBackpacks(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.length).toBe(3);
      expect(data[0].name).toBe('Urban Commuter'); // Alphabetically last
      expect(data[2].name).toBe('Day Hiker');      // Alphabetically first
    });
  });
}); 