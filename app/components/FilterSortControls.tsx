'use client';

import React from 'react';
import { FaFilter, FaSort } from 'react-icons/fa';

export type SortOption = 'name' | 'brand' | 'weight' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

interface FilterSortControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (direction: SortDirection) => void;
  materialFilter: string;
  onMaterialFilterChange: (material: string) => void;
  materialOptions: string[];
}

export default function FilterSortControls({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortDirection,
  onSortDirectionChange,
  materialFilter,
  onMaterialFilterChange,
  materialOptions
}: FilterSortControlsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FaFilter size={14} />
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or brand..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        
        {/* Material Filter */}
        <div>
          <label htmlFor="materialFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Material
          </label>
          <select
            id="materialFilter"
            value={materialFilter}
            onChange={(e) => onMaterialFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Materials</option>
            {materialOptions.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sort Controls */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FaSort size={14} />
            Sort By
          </label>
          <div className="flex gap-2">
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="name">Name</option>
              <option value="brand">Brand</option>
              <option value="weight">Weight</option>
              <option value="createdAt">Date Added</option>
            </select>
            
            <button
              onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
              aria-label={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 