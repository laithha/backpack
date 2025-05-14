import { NextRequest, NextResponse } from 'next/server';
import { backpackDb } from '../../db/backpackStore';
import { backpackUpdateSchema } from '../../models/backpackSchema';

// GET /api/backpacks/[id] - Get a specific backpack by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backpack = backpackDb.getById(params.id);
    
    if (!backpack) {
      return NextResponse.json(
        { error: 'Backpack not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(backpack);
  } catch (error) {
    console.error(`Error getting backpack with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to retrieve backpack' },
      { status: 500 }
    );
  }
}

// PATCH /api/backpacks/[id] - Update a backpack by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // First check if the backpack exists
    const existingBackpack = backpackDb.getById(params.id);
    if (!existingBackpack) {
      return NextResponse.json(
        { error: 'Backpack not found' },
        { status: 404 }
      );
    }
    
    // Validate the update data
    const validationResult = backpackUpdateSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Update the backpack
    const updatedBackpack = backpackDb.updateBackpack(params.id, validationResult.data);
    
    return NextResponse.json(updatedBackpack);
  } catch (error) {
    console.error(`Error updating backpack with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update backpack' },
      { status: 500 }
    );
  }
}

// DELETE /api/backpacks/[id] - Delete a backpack by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First check if the backpack exists
    const existingBackpack = backpackDb.getById(params.id);
    if (!existingBackpack) {
      return NextResponse.json(
        { error: 'Backpack not found' },
        { status: 404 }
      );
    }
    
    // Delete the backpack
    const deleted = backpackDb.deleteBackpack(params.id);
    
    if (deleted) {
      return new NextResponse(null, { status: 204 });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete backpack' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error deleting backpack with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete backpack' },
      { status: 500 }
    );
  }
} 