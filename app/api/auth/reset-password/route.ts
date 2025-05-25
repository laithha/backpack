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

    const { token, password } = body;

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { message: 'Reset token and new password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
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
      return NextResponse.json(
        { message: 'Invalid reset token' },
        { status: 400 }
      );
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

      return NextResponse.json(
        { message: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    // Note: In a real application, you should hash the password before storing it
    // For this demo, we're storing plain text passwords (not recommended for production)
    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [password, user.id]
    );

    console.log(`Password reset successful for user: ${user.email}`);

    return NextResponse.json({
      message: 'Password has been reset successfully',
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 