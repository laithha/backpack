export const isNumber = (value: string): boolean => {
  return !isNaN(Number(value));
};

export const isNameValid = (name: string): boolean => {
  return name.length >= 3;
};

export const isBrandValid = (brand: string): boolean => {
  return brand.length >= 3;
};

export const isMaterialValid = (material: string): boolean => {
  return material.length >= 3;
};

export const validateBackpackInputs = (name: string, brand: string, material: string, weight: string): { isValid: boolean; error: string } => {
  if (!isNumber(weight)) {
    return { isValid: false, error: "Weight must be a number!" };
  }
  if (!isNameValid(name)) {
    return { isValid: false, error: "The name is too short! It must be at least 3 letters" };
  }
  if (!isBrandValid(brand)) {
    return { isValid: false, error: "The brand is too short, it must be at least 3 letters" };
  }
  if (!isMaterialValid(material)) {
    return { isValid: false, error: "The material is too short, it must be at least 3 letters" };
  }
  return { isValid: true, error: "" };
}; 