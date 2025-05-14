'use client';

import React, { useState, useEffect } from 'react';
import { BackpackFormData, Backpack } from '../models/backpack';
import { validateBackpackForm, ValidationError, hasErrors } from '../utils/validators';
import { FaShoppingBag, FaTimes } from 'react-icons/fa';

interface BackpackFormProps {
  initialData?: Partial<BackpackFormData>;
  onSubmit: (data: BackpackFormData) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

const materialOptions = ['Nylon', 'Polyester', 'Canvas', 'Leather', 'Cordura', 'Cotton', 'Other'];

export default function BackpackForm({ initialData, onSubmit, onCancel, isEdit = false }: BackpackFormProps) {
  const [formData, setFormData] = useState<Partial<BackpackFormData>>({
    name: '',
    brand: '',
    material: '',
    weight: undefined,
    ...initialData
  });
  
  const [errors, setErrors] = useState<ValidationError>({});
  const [touched, setTouched] = useState<Record<keyof BackpackFormData, boolean>>({
    name: false,
    brand: false,
    material: false,
    weight: false
  });

  // Validate on form data change if field was touched
  useEffect(() => {
    const newErrors = validateBackpackForm(formData);
    setErrors(newErrors);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' ? (value ? Number(value) : undefined) : value
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      brand: true,
      material: true,
      weight: true
    });
    
    // Final validation
    const newErrors = validateBackpackForm(formData);
    setErrors(newErrors);
    
    if (!hasErrors(newErrors) && formData.name && formData.brand && formData.material && formData.weight) {
      onSubmit(formData as BackpackFormData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <FaShoppingBag size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Edit Backpack' : 'Add New Backpack'}
          </h2>
        </div>
        
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <FaTimes size={18} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Backpack Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              touched.name && errors.name 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
            placeholder="e.g. Mountain Explorer 45L"
          />
          {touched.name && errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              touched.brand && errors.brand 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
            placeholder="e.g. OutdoorTech"
          />
          {touched.brand && errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
            Material
          </label>
          <select
            id="material"
            name="material"
            value={formData.material || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              touched.material && errors.material 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
          >
            <option value="">Select a material</option>
            {materialOptions.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
          {touched.material && errors.material && (
            <p className="mt-1 text-sm text-red-600">{errors.material}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight (grams)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              touched.weight && errors.weight 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
            placeholder="e.g. 1200"
            min="1"
            step="1"
          />
          {touched.weight && errors.weight && (
            <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
          )}
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors"
          >
            {isEdit ? 'Update Backpack' : 'Add Backpack'}
          </button>
        </div>
      </form>
    </div>
  );
} 