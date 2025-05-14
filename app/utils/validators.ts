import { BackpackFormData } from '../models/backpack';

export type ValidationError = {
  [key in keyof BackpackFormData]?: string;
};
export function isNumber(numStr: string) {
  return !isNaN(parseFloat(numStr)) && !isNaN(+numStr);
}
export const validateBackpackForm = (data: Partial<BackpackFormData>): ValidationError => {
  const errors: ValidationError = {};

  // Name validation
  if (!data.name) {
    errors.name = 'Name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.length > 50) {
    errors.name = 'Name must be less than 50 characters';
  }

  // Brand validation
  if (!data.brand) {
    errors.brand = 'Brand is required';
  } else if (data.brand.length < 2) {
    errors.brand = 'Brand must be at least 2 characters';
  } else if (data.brand.length > 30) {
    errors.brand = 'Brand must be less than 30 characters';
  }

  // Material validation
  if (!data.material) {
    errors.material = 'Material is required';
  }

  // Weight validation
  if (data.weight === undefined || data.weight === null) {
    errors.weight = 'Weight is required';
  } else if (isNaN(Number(data.weight))) {
    errors.weight = 'Weight must be a number';
  } else if (Number(data.weight) <= 0) {
    errors.weight = 'Weight must be greater than 0';
  } else if (Number(data.weight) > 10000) {
    errors.weight = 'Weight must be less than 10kg (10,000g)';
  }

  return errors;
};

export const hasErrors = (errors: ValidationError): boolean => {
  return Object.keys(errors).length > 0;
}; 