import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { sign, SignOptions } from 'jsonwebtoken';
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

    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Query user from database
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // In a real application, you would hash the password and compare hashes
    // For this example, we're doing a direct comparison
    if (password !== user.password) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if 2FA is enabled
    if (user.two_factor_enabled) {
      // Generate a temporary token for 2FA verification
      const tempToken = sign(
        { userId: user.id },
        env.jwt.secret,
        { expiresIn: '5m' }
      );

      return NextResponse.json({
        requires2FA: true,
        tempToken,
      });
    }

    // If 2FA is not enabled, generate a regular session token
    const token = sign(
      { userId: user.id },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn } as SignOptions
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 