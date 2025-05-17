import { NextRequest, NextResponse } from 'next/server';
import { backpackDb } from '../../db/backpackStore';
import { Backpack } from '../../db/backpackStore';

// GET /api/backpacks/sort - Sort backpacks by criteria
//http://localhost:3000/api/backpacks/sort?sortBy=weight&order=asc this is the url to test it in postman and use the get method to get the backpacks in ascending order love you <3
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sortBy = searchParams.get('sortBy') as keyof Backpack | null;
    const order = searchParams.get('order') as 'asc' | 'desc' | null;
    // Validate sort parameters
    if (!sortBy) {
      return NextResponse.json(
        { error: 'Missing required parameter: sortBy' },
        { status: 400 }
      );
    }
    if (!order || (order !== 'asc' && order !== 'desc')) {
      return NextResponse.json(
        { error: 'Invalid or missing order parameter. Use "asc" or "desc"' },
        { status: 400 }
      );
    }
    // Get all backpacks and sort them
    const backpacks = backpackDb.getSorted(sortBy, order);
    return NextResponse.json(backpacks);
  } catch (error) {
    console.error('Error sorting backpacks:', error);
    return NextResponse.json(
      { error: 'Failed to sort backpacks' },
      { status: 500 }
    );
  }
} 