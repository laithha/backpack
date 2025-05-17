import { NextRequest, NextResponse } from 'next/server';
import { backpackDb } from '../../db/backpackStore';

// GET /api/backpacks/filter - Filter backpacks by criteria
// http://localhost:3000/api/backpacks/filter?brand=OutdoorTech this is the url to test it in postman and use the get method so that you can see the data in the browser
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const brand = searchParams.get('brand');
    const material = searchParams.get('material');
    const color = searchParams.get('color');
    const weightMin = searchParams.get('weightMin');
    const weightMax = searchParams.get('weightMax');
    
    // Build filters object
    const filters: Record<string, any> = {};
    if (brand) filters.brand = brand;
    if (material) filters.material = material;
    if (color) filters.color = color;
    
    // Get filtered backpacks
    let backpacks = backpackDb.getFiltered(filters);
    
    // Additional filtering for numeric ranges that can't be handled by getFiltered
    if (weightMin || weightMax) {
      backpacks = backpacks.filter(backpack => {
        if (weightMin && backpack.weight < parseInt(weightMin)) return false;
        if (weightMax && backpack.weight > parseInt(weightMax)) return false;
        return true;
      });
    }
    
    return NextResponse.json(backpacks);
  } catch (error) {
    console.error('Error filtering backpacks:', error);
    return NextResponse.json(
      { error: 'Failed to filter backpacks' },
      { status: 500 }
    );
  }
} 