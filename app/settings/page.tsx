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

          {/* Settings Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            
            {/* Security Settings Card */}
            <Link href="/settings/2fa" style={{ textDecoration: "none" }}>
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "32px",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                border: "1px solid #e5e7eb"
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

            {/* Account Information Card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "32px",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <div style={{
                  width: "48px", height: "48px", backgroundColor: "#f3e8ff", borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px"
                }}>
                  <svg width="24" height="24" fill="none" stroke="#8b5cf6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "600", color: "black", margin: 0 }}>
                    Account Information
                  </h3>
                </div>
              </div>
              <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", margin: 0 }}>
                View and update your account details, email, and personal information.
              </p>
              <div style={{ marginTop: "16px", color: "#6b7280", fontSize: "14px" }}>
                Coming soon...
              </div>
            </div>

            {/* Preferences Card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "32px",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <div style={{
                  width: "48px", height: "48px", backgroundColor: "#ecfdf5", borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px"
                }}>
                  <svg width="24" height="24" fill="none" stroke="#10b981" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "600", color: "black", margin: 0 }}>
                    Preferences
                  </h3>
                </div>
              </div>
              <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", margin: 0 }}>
                Customize your app experience, notifications, and display preferences.
              </p>
              <div style={{ marginTop: "16px", color: "#6b7280", fontSize: "14px" }}>
                Coming soon...
              </div>
            </div>

            {/* Data & Privacy Card */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "32px",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <div style={{
                  width: "48px", height: "48px", backgroundColor: "#fef3c7", borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px"
                }}>
                  <svg width="24" height="24" fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "600", color: "black", margin: 0 }}>
                    Data & Privacy
                  </h3>
                </div>
              </div>
              <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", margin: 0 }}>
                Control your data, privacy settings, and manage what information is shared.
              </p>
              <div style={{ marginTop: "16px", color: "#6b7280", fontSize: "14px" }}>
                Coming soon...
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 