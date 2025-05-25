import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { env } from '../../../config/env';

const pool = new Pool({
  connectionString: env.database.url,
});

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { token } = body;

    // Validate input
    if (!token) {
      return NextResponse.json(
        { message: 'Reset token is required', valid: false },
        { status: 400 }
      );
    }

    // Check if token exists and is not expired
    const result = await pool.query(
      'SELECT id, email, reset_token_expiry FROM users WHERE reset_token = $1',
      [token]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({
        message: 'Invalid reset token',
        valid: false,
      });
    }

    // Check if token has expired
    const now = new Date();
    const expiry = new Date(user.reset_token_expiry);

    if (now > expiry) {
      // Clean up expired token
      await pool.query(
        'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = $1',
        [user.id]
      );

      return NextResponse.json({
        message: 'Reset token has expired',
        valid: false,
      });
    }

    return NextResponse.json({
      message: 'Reset token is valid',
      valid: true,
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { message: 'Internal server error', valid: false },
      { status: 500 }
    );
  }
} 