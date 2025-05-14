import React from "react";
import { Backpack } from "../models/backpack";
import { cardStyle, gridContainerStyle } from "../styles/pageStyles";

interface BackpackListProps {
  backpacks: Backpack[];
  color: string;
}

export const BackpackList: React.FC<BackpackListProps> = ({ backpacks, color }) => {
  return (
    <div style={gridContainerStyle}>
      {backpacks.length === 0 ? (
        <h1 style={{ gridColumn: "span 3", textAlign: "center", color: "black" }}>
          No backpacks added yet.
        </h1>
      ) : (
        backpacks.map((backpack, index) => (
          <div key={index} style={cardStyle}>
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
        ))
      )}
    </div>
  );
};
