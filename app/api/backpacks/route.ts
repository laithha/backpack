import { NextRequest, NextResponse } from 'next/server';
import { backpackDb } from '../db/backpackStore';
import { backpackSchema } from '../models/backpackSchema';

// GET /api/backpacks - Get all backpacks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Check if this is a filtered request
    const brandFilter = searchParams.get('brand');
    const materialFilter = searchParams.get('material');
    
    // Check if this is a sorted request
    const sortBy = searchParams.get('sortBy') as keyof ReturnType<typeof backpackDb.getAll>[0] | null;
    const sortOrder = searchParams.get('order') as 'asc' | 'desc' | null;
    
    let backpacks;
    
    // Handle filtering
    if (brandFilter || materialFilter) {
      const filters: Record<string, string> = {};
      if (brandFilter) filters.brand = brandFilter;
      if (materialFilter) filters.material = materialFilter;
      backpacks = backpackDb.getFiltered(filters);
    } 
    // Handle sorting
    else if (sortBy && (sortOrder === 'asc' || sortOrder === 'desc')) {
      backpacks = backpackDb.getSorted(sortBy, sortOrder);
    } 
    // Default: get all
    else {
      backpacks = backpackDb.getAll();
    }
    
    return NextResponse.json(backpacks);
  } catch (error) {
    console.error('Error getting backpacks:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve backpacks' },
      { status: 500 }
    );
  }
}

// POST /api/backpacks - Create a new backpack
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the input data
    const validationResult = backpackSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Create the backpack
    const newBackpack = backpackDb.addBackpack(validationResult.data);
    
    return NextResponse.json(newBackpack, { status: 201 });
  } catch (error) {
    console.error('Error creating backpack:', error);
    return NextResponse.json(
      { error: 'Failed to create backpack' },
      { status: 500 }
    );
  }
} 