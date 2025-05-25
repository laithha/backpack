'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import TwoFactorSetup from '../../components/TwoFactorSetup';

export default function TwoFactorSettings() {
  const router = useRouter();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication first
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    setIsAuthenticated(true);
    check2FAStatus();
  }, [router]);

  const check2FAStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/2fa/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
        // Token is invalid, redirect to login
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      
      const data = await response.json();
      setIs2FAEnabled(data.enabled);
    } catch (err) {
      console.error('Failed to fetch 2FA status:', err);
      toast.error('Failed to load 2FA status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIs2FAEnabled(false);
        toast.success('Two-factor authentication has been disabled');
      } else {
        toast.error(data.message || 'Failed to disable 2FA');
      }
    } catch (err) {
      console.error('Failed to disable 2FA:', err);
      toast.error('An error occurred while disabling 2FA');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "18px", color: "black" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "white" }}>
      {/* Navigation Sidebar */}
      <nav
        style={{
          width: "220px", height: "100vh", backgroundColor: "#1e1e2f",
          color: "white", display: "flex", flexDirection: "column",
          alignItems: "flex-start", padding: "30px 20px", gap: "20px",
          position: "fixed", left: "0", top: "0", boxShadow: "2px 0 8px rgba(0,0,0,0.3)",
        }}
      >
        <Link href="/" style={{
          backgroundColor: "#0070f3", padding: "10px", width: "100%",
          textAlign: "center", color: "white", textDecoration: "none",
          fontWeight: "bold", fontSize: "18px", borderRadius: "8px",
        }}>
          Backpack Management
        </Link>
        
        <Link href="/" style={{
          background: "#2c2c3e", color: "white", textDecoration: "none",
          padding: "10px 15px", width: "100%", borderRadius: "8px", textAlign: "center",
        }}>
          ← Back to Dashboard
        </Link>
        
        <div style={{
          background: "#4c4c5e", color: "white",
          padding: "10px 15px", width: "100%", borderRadius: "8px", textAlign: "center",
        }}>
          2FA Settings
        </div>
        
        <button onClick={handleLogout} style={{
          background: "#dc3545", color: "white", border: "none",
          padding: "10px 15px", width: "100%", borderRadius: "8px", cursor: "pointer",
          marginTop: "auto"
        }}>
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div style={{ marginLeft: "220px", padding: "40px", flex: 1, overflowY: "auto", backgroundColor: "#f8f9fa" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "32px", color: "black" }}>
            Two-Factor Authentication Settings
          </h1>

          {/* 2FA Status Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "32px",
            marginBottom: "24px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px", color: "black" }}>
                  Two-Factor Authentication
                </h2>
                <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5" }}>
                  {is2FAEnabled
                    ? 'Two-factor authentication is currently enabled for your account. Your account is protected with an extra layer of security.'
                    : 'Add an extra layer of security to your account by enabling two-factor authentication. This helps protect your account even if your password is compromised.'}
                </p>
              </div>
              <div style={{ marginLeft: "24px" }}>
                <span
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: is2FAEnabled ? "#dcfce7" : "#f3f4f6",
                    color: is2FAEnabled ? "#166534" : "#374151"
                  }}
                >
                  {is2FAEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {is2FAEnabled ? (
              <div style={{ marginTop: "24px" }}>
                <button
                  onClick={handleDisable2FA}
                  style={{
                    width: "100%",
                    backgroundColor: "#dc2626",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = "#b91c1c"}
                  onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = "#dc2626"}
                >
                  Disable Two-Factor Authentication
                </button>
              </div>
            ) : (
              <div style={{ marginTop: "24px" }}>
                <TwoFactorSetup onSetupComplete={() => {
                  setIs2FAEnabled(true);
                  toast.success('Two-factor authentication has been enabled successfully!');
                }} />
              </div>
            )}
          </div>

          {/* Security Recommendations Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "32px"
          }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px", color: "black" }}>
              Security Recommendations
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#6b7280" }}>
              <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ marginRight: "12px", color: "#10b981", fontWeight: "bold" }}>✓</span>
                <span>Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ marginRight: "12px", color: "#10b981", fontWeight: "bold" }}>✓</span>
                <span>Keep your backup codes in a secure location (password manager or safe)</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ marginRight: "12px", color: "#10b981", fontWeight: "bold" }}>✓</span>
                <span>Never share your 2FA codes with anyone - legitimate services will never ask for them</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ marginRight: "12px", color: "#10b981", fontWeight: "bold" }}>✓</span>
                <span>Use a strong, unique password for your account</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start" }}>
                <span style={{ marginRight: "12px", color: "#10b981", fontWeight: "bold" }}>✓</span>
                <span>Regularly review your account activity and security settings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 