import React from "react";
import Link from "next/link";
import { navStyle, navButtonStyle } from "../styles/pageStyles";

interface NavigationProps {
  onAddClick: () => void;
  onDeleteClick: () => void;
  onListClick: () => void;
  onUpdateClick: () => void;
  onFilterClick: () => void;
  onSortIncreasingClick: () => void;
  onSortDecreasingClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onAddClick,
  onDeleteClick,
  onListClick,
  onUpdateClick,
  onFilterClick,
  onSortIncreasingClick,
  onSortDecreasingClick,
}) => {
  return (
    <nav style={navStyle}>
      <Link
        href="/"
        style={{
          backgroundColor: "#0070f3",
          padding: "10px",
          width: "100%",
          textAlign: "center",
          color: "white",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "18px",
          borderRadius: "8px",
        }}
      >
        Backpack Management Website
      </Link>
      <button onClick={onAddClick} style={navButtonStyle}>
        Add Backpack
      </button>
      <button onClick={onDeleteClick} style={navButtonStyle}>
        Delete Backpack
      </button>
      <button onClick={onListClick} style={navButtonStyle}>
        List Backpacks
      </button>
      <button onClick={onUpdateClick} style={navButtonStyle}>
        Update Backpack
      </button>
      <button onClick={onFilterClick} style={navButtonStyle}>
        Filter By Brand
      </button>
      <button onClick={onSortIncreasingClick} style={navButtonStyle}>
        Sort by weight increasing
      </button>
      <button onClick={onSortDecreasingClick} style={navButtonStyle}>
        Sort by weight decreasing
      </button>
    </nav>
  );
};
