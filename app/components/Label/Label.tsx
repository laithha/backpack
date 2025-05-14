import React from "react";

const Label: React.FC<LabelProps> = ({ text, children, labelFor }) => {
  return (
    <label
      htmlFor={labelFor}
      className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
    >
      {children}
      {text}
    </label>
  );
};

export default Label;
