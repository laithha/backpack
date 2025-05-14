"use client";

import React from "react";
import { FaFilter, FaSort } from "react-icons/fa";
import Label from "./Label/Label";

export type SortOption = "name" | "brand" | "weight" | "createdAt";
export type SortDirection = "asc" | "desc";

export default function FilterSortControls({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortDirection,
  onSortDirectionChange,
  materialFilter,
  onMaterialFilterChange,
  materialOptions,
}: FilterSortControlsProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "name", label: "Name" },
    { value: "brand", label: "Brand" },
    { value: "weight", label: "Weight" },
    { value: "createdAt", label: "Date Added" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <Label labelFor="search" children={<FaFilter size={14} />} text="Sort by" />
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
          <Label labelFor="materialFilter" children={<FaSort size={14} />} text="Filter" />
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
          <Label labelFor="sortBy" children={<FaSort size={14} />} text="Sort by" />
          <div className="flex gap-2">
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc")}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
              aria-label={sortDirection === "asc" ? "Sort descending" : "Sort ascending"}
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
