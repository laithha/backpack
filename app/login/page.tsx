'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TwoFactorVerify from '../components/TwoFactorVerify';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires2FA) {
          setTempToken(data.tempToken);
          setShow2FA(true);
        } else {
          // Regular login successful - store token and redirect
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          router.push('/');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = async (code: string) => {
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, tempToken }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and redirect
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        router.push('/');
      } else {
        setError(data.message || '2FA verification failed');
      }
    } catch (err) {
      setError('An error occurred during 2FA verification');
    }
  };

  if (show2FA) {
    return (
      <TwoFactorVerify
        onVerify={handle2FAVerify}
        onCancel={() => {
          setShow2FA(false);
          setTempToken('');
        }}
      />
    );
  }

  return (
    
   <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg w-full max-w-sm px-8 py-10">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((v) => !v)}
                className="mr-1"
              />
              Show Password
            </label>
            <Link href="/forgot-password" className="text-indigo-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-md font-semibold transition disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-indigo-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
);
}