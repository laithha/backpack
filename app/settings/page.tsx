'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // Check authentication first
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    setIsLoading(false);
    // In a real app, you might fetch user info here
    setUserInfo({ email: 'user@example.com', name: 'User' });
  }, [router]);

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
          Settings
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
            Account Settings
          </h1>

          {/* Settings Grid - Centered single card */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            
            {/* Security Settings Card */}
            <Link href="/settings/2fa" style={{ textDecoration: "none" }}>
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "32px",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                border: "1px solid #e5e7eb",
                width: "400px"
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{
                    width: "48px", height: "48px", backgroundColor: "#dbeafe", borderRadius: "12px",
                    display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px"
                  }}>
                    <svg width="24" height="24" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: "600", color: "black", margin: 0 }}>
                      Security & 2FA
                    </h3>
                  </div>
                </div>
                <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", margin: 0 }}>
                  Manage two-factor authentication and security settings for your account.
                </p>
                <div style={{ marginTop: "16px", color: "#3b82f6", fontSize: "14px", fontWeight: "500" }}>
                  Configure 2FA →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 