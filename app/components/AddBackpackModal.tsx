import React from "react";
import { modalStyle, inputStyle, confirmButton, cancelButton } from "../styles/pageStyles";

interface AddBackpackModalProps {
  name: string;
  brand: string;
  material: string;
  weight: string;
  color: string;
  onNameChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onMaterialChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onAdd: () => void;
  onClose: () => void;
}

export const AddBackpackModal: React.FC<AddBackpackModalProps> = ({
  name,
  brand,
  material,
  weight,
  color,
  onNameChange,
  onBrandChange,
  onMaterialChange,
  onWeightChange,
  onColorChange,
  onAdd,
  onClose,
}) => {
  const handleQuickAdd = (
    name: string,
    brand: string,
    material: string,
    weight: string,
    color: string
  ) => {
    onNameChange(name);
    onBrandChange(brand);
    onMaterialChange(material);
    onWeightChange(weight);
    onColorChange(color);
  };

  return (
    <div style={modalStyle}>
      <h3>Add Backpack</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Name"
        style={inputStyle}
      />
      <input
        type="text"
        value={brand}
        onChange={(e) => onBrandChange(e.target.value)}
        placeholder="Brand"
        style={inputStyle}
      />
      <input
        type="text"
        value={material}
        onChange={(e) => onMaterialChange(e.target.value)}
        placeholder="Material"
        style={inputStyle}
      />
      <input
        type="text"
        value={weight}
        onChange={(e) => onWeightChange(e.target.value)}
        placeholder="Weight"
        style={inputStyle}
      />
      <input
        type="text"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        placeholder="Color"
        style={inputStyle}
      />
      <button
        onClick={() => handleQuickAdd("Nike Backpack", "Nike", "cotton", "5", "red")}
        style={{
          backgroundColor: "#f0f0f0",
          color: "black",
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        quickadd
      </button>
      <button
        onClick={() => handleQuickAdd("Adidas Backpack", "Adidas", "cotton", "2", "red")}
        style={{
          backgroundColor: "#f0f0f0",
          color: "black",
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        quickadd
      </button>
      <button
        onClick={() => handleQuickAdd("Rebook Backpack", "Nike", "cotton", "4", "red")}
        style={{
          backgroundColor: "#f0f0f0",
          color: "black",
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        quickadd
      </button>
      <button
        onClick={() => handleQuickAdd("LV Backpack", "Nike", "cotton", "1", "red")}
        style={{
          backgroundColor: "#f0f0f0",
          color: "black",
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        quickadd
      </button>
      <button onClick={onAdd} style={confirmButton}>
        Add
      </button>
      <button onClick={onClose} style={cancelButton}>
        Close
      </button>
    </div>
  );
};
