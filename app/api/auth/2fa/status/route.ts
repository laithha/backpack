import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { verify } from 'jsonwebtoken';
import { env } from '../../../../config/env';

const pool = new Pool({
  connectionString: env.database.url,
});

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = verify(token, env.jwt.secret) as { userId: string };
    } catch (err) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user's 2FA status
    const result = await pool.query(
      'SELECT two_factor_enabled FROM users WHERE id = $1',
      [decoded.userId]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      enabled: user.two_factor_enabled || false,
    });

  } catch (error) {
    console.error('2FA status check error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 