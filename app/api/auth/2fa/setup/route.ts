import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { verify } from 'jsonwebtoken';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { env } from '../../../../config/env';

const pool = new Pool({
  connectionString: env.database.url,
});

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    
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

    // Get user information
    const userResult = await pool.query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [decoded.userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Generate a secret for the user
    const secret = authenticator.generateSecret();
    
    // Create the service name and account name for the QR code
    const serviceName = 'Backpack Management';
    const accountName = user.email;
    
    // Generate the otpauth URL
    const otpauthUrl = authenticator.keyuri(accountName, serviceName, secret);
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
    
    // Store the secret temporarily (we'll confirm it when they verify)
    await pool.query(
      'UPDATE users SET two_factor_secret = $1 WHERE id = $2',
      [secret, user.id]
    );

    return NextResponse.json({
      qrCode: qrCodeDataUrl,
      secret: secret,
      email: user.email,
      message: 'QR code generated successfully'
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 