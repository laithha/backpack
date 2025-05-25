'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TwoFactorSetupProps {
  onSetupComplete: () => void;
}

export default function TwoFactorSetup({ onSetupComplete }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'initial' | 'qr' | 'verify'>('initial');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const startSetup = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.qrCode) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setEmail(data.email);
        setStep('qr');
      } else {
        setError(data.message || 'Failed to start 2FA setup');
      }
    } catch (err) {
      setError('Failed to start 2FA setup');
    }
  };

  const verifyCode = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await response.json();
      if (data.success) {
        onSetupComplete();
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('Failed to verify code');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Two-Factor Authentication Setup</h2>
      
      {step === 'initial' && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Enhance your account security by enabling two-factor authentication.
          </p>
          <button
            onClick={startSetup}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Start Setup
          </button>
        </div>
      )}

      {step === 'qr' && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Scan this QR code with your authenticator app (like Google Authenticator or Authy)
          </p>
          {qrCode && (
            <div className="flex justify-center">
              <Image
                src={qrCode}
                alt="2FA QR Code"
                width={200}
                height={200}
                className="border p-2"
              />
            </div>
          )}
          
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600 mb-2">
              Can't scan? Enter this code manually in your authenticator app:
            </p>
            <p className="text-xs font-mono bg-white p-2 rounded border break-all">
              Account: {email}<br/>
              Key: {secret}
            </p>
          </div>
          
          <div className="space-y-2">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={verifyCode}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Verify Code
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
} 