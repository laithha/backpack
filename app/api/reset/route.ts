import { NextRequest, NextResponse } from 'next/server';
import { backpackDb } from '../db/backpackStore';

// POST /api/reset - Reset the database (for testing purposes)
export async function POST(request: NextRequest) {
  try {
    // Reset the database with sequential IDs
    backpackDb.resetDatabase();
    
    return NextResponse.json({ 
      message: 'Database reset successfully. All backpacks now have sequential IDs (1, 2, 3, etc.)' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    );
  }
} 