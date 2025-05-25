import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { verify, sign, SignOptions } from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { env } from '../../../../config/env';

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

    const { code, tempToken } = body;

    // Validate input
    if (!code) {
      return NextResponse.json(
        { message: 'Verification code is required' },
        { status: 400 }
      );
    }

    let userId;

    // If we have a tempToken (from login flow), use that
    if (tempToken) {
      try {
        const decoded = verify(tempToken, env.jwt.secret) as { userId: string };
        userId = decoded.userId;
      } catch (err) {
        return NextResponse.json(
          { message: 'Invalid temporary token' },
          { status: 401 }
        );
      }
    } else {
      // Otherwise, get from Authorization header (setup flow)
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');
      
      if (!token) {
        return NextResponse.json(
          { message: 'Authentication required' },
          { status: 401 }
        );
      }

      try {
        const decoded = verify(token, env.jwt.secret) as { userId: string };
        userId = decoded.userId;
      } catch (err) {
        return NextResponse.json(
          { message: 'Invalid token' },
          { status: 401 }
        );
      }
    }

    // Get user and their 2FA secret
    const userResult = await pool.query(
      'SELECT id, email, name, two_factor_secret FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.two_factor_secret) {
      return NextResponse.json(
        { message: '2FA not set up for this user' },
        { status: 400 }
      );
    }

    // Verify the TOTP code
    const isValid = authenticator.verify({
      token: code,
      secret: user.two_factor_secret,
    });

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // If this is the setup flow (no tempToken), enable 2FA
    if (!tempToken) {
      await pool.query(
        'UPDATE users SET two_factor_enabled = true WHERE id = $1',
        [userId]
      );
    }

    // If this is the login flow (with tempToken), generate a full session token
    if (tempToken) {
      const sessionToken = sign(
        { userId: user.id },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn } as SignOptions
      );

      return NextResponse.json({
        success: true,
        token: sessionToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: '2FA verification successful',
    });

  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 