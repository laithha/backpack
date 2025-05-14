'use client';

import { Backpack } from '../models/backpack';
import { FaTrash, FaEdit, FaWeightHanging, FaShoppingBag } from 'react-icons/fa';
import { MdOutlineBrandingWatermark } from 'react-icons/md';
import { GiMaterialsScience } from 'react-icons/gi';

interface BackpackCardProps {
  backpack: Backpack;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function BackpackCard({ backpack, onEdit, onDelete }: BackpackCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FaShoppingBag size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{backpack.name}</h3>
          </div>
          
          <div className="flex gap-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(backpack.id)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
              >
                <FaEdit size={18} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(backpack.id)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <FaTrash size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <MdOutlineBrandingWatermark size={18} />
            <span className="font-medium">Brand:</span> {backpack.brand}
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <GiMaterialsScience size={18} />
            <span className="font-medium">Material:</span> {backpack.material}
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <FaWeightHanging size={18} />
            <span className="font-medium">Weight:</span> {backpack.weight}g
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Added on {formatDate(backpack.createdAt)}
        </div>
      </div>
    </div>
  );
} 