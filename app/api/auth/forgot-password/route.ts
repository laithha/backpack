import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { randomBytes } from 'crypto';
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

    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      // For security reasons, we don't reveal if the email exists or not
      // We return success even if the email doesn't exist
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent password reset instructions.',
      });
    }

    // Generate a secure reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the reset token in the database
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [resetToken, resetTokenExpiry, user.id]
    );

    // For this demo, we'll log the reset link to the console
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log('='.repeat(80));
    console.log('PASSWORD RESET REQUEST');
    console.log('='.repeat(80));
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token expires: ${resetTokenExpiry.toISOString()}`);
    console.log('='.repeat(80));
    
    // TODO: Replace this with actual email sending
    // Example with a service like SendGrid, AWS SES, or Nodemailer:
    /*
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
    */

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      message: 'Password reset instructions have been sent to your email.',
      // In development, you might want to include the reset URL for testing
      ...(process.env.NODE_ENV === 'development' && { 
        resetUrl,
        note: 'Check the server console for the reset link (development only)'
      })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 