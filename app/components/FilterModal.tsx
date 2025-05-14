import React from "react";
import { Backpack } from "../models/backpack";
import { modalStyle, inputStyle, cancelButton } from "../styles/pageStyles";

interface FilterModalProps {
  backpacks: Backpack[];
  searchBrand: string;
  color: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  backpacks,
  searchBrand,
  color,
  onSearchChange,
  onClose,
}) => {
  return (
    <div style={modalStyle}>
      <h3>Filter Backpacks by Brand</h3>
      <input
        type="text"
        placeholder="Enter brand name to filter"
        value={searchBrand}
        onChange={(e) => onSearchChange(e.target.value)}
        style={inputStyle}
      />

      {searchBrand && (
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            width: "100%",
            marginTop: "15px",
          }}
        >
          {backpacks.filter((bp) => bp.brand.toLowerCase().includes(searchBrand.toLowerCase()))
            .length === 0 ? (
            <div
              style={{
                padding: "15px",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                color: "black",
              }}
            >
              No backpacks match the brand "{searchBrand}".
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {backpacks
                .filter((bp) => bp.brand.toLowerCase().includes(searchBrand.toLowerCase()))
                .map((backpack, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "white",
                      padding: "15px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      color: "black",
                    }}
                  >
                    <p>
                      <strong>Name:</strong> {backpack.name}
                    </p>
                    <p>
                      <strong>Brand:</strong> {backpack.brand}
                    </p>
                    <p>
                      <strong>Material:</strong> {backpack.material}
                    </p>
                    <p>
                      <strong>Weight:</strong> {backpack.weight}g
                    </p>
                    <p>
                      <strong>Color:</strong> {color}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      <button
        onClick={onClose}
        style={{
          ...cancelButton,
          marginTop: "15px",
        }}
      >
        Close
      </button>
    </div>
  );
};
