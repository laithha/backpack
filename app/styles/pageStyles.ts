import { CSSProperties } from 'react';

export const modalStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "5px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "300px"
};

export const inputStyle: CSSProperties = {
  padding: "10px",
  width: "100%",
  borderRadius: "6px",
  border: "1px solid #ccc",
  outline: "none",
  backgroundColor: "#f5f5f5",
  color: "black"
};

export const confirmButton: CSSProperties = {
  backgroundColor: "#28a745",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export const cancelButton: CSSProperties = {
  backgroundColor: "#dc3545",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export const cardStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
};

export const navStyle: CSSProperties = {
  width: "220px",
  height: "100vh",
  backgroundColor: "#1e1e2f",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "30px 20px",
  gap: "20px",
  position: "fixed",
  left: "0",
  top: "0",
  boxShadow: "2px 0 8px rgba(0,0,0,0.3)",
};

export const navButtonStyle: CSSProperties = {
  background: "#2c2c3e",
  color: "white",
  border: "none",
  padding: "10px 15px",
  width: "100%",
  borderRadius: "8px",
  cursor: "pointer",
};

export const mainContentStyle: CSSProperties = {
  marginLeft: "220px",
  padding: "20px",
  flex: 1,
  overflowY: "auto",
  backgroundColor: "white",
  color: "black"
};

export const gridContainerStyle: CSSProperties = {
  marginTop: "20px",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  overflowY: "auto",
}; 