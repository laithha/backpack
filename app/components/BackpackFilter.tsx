import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface BackpackFilterProps {
  onFilterChange: (filters: any) => void;
  onSortChange: (sort: any) => void;
}

export const BackpackFilter: React.FC<BackpackFilterProps> = ({ onFilterChange, onSortChange }) => {
  const [filters, setFilters] = useState({
    brand: '',
    material: '',
    minWeight: '',
    maxWeight: ''
  });

  const [sortConfig, setSortConfig] = useState({
    field: 'createdAt',
    order: 'DESC'
  });

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (field: string) => {
    const newSortConfig = {
      field,
      order: sortConfig.field === field && sortConfig.order === 'ASC' ? 'DESC' : 'ASC'
    };
    setSortConfig(newSortConfig);
    onSortChange(newSortConfig);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Filter by brand"
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <input
          type="text"
          placeholder="Filter by material"
          value={filters.material}
          onChange={(e) => handleFilterChange('material', e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <input
          type="number"
          placeholder="Min weight"
          value={filters.minWeight}
          onChange={(e) => handleFilterChange('minWeight', e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <input
          type="number"
          placeholder="Max weight"
          value={filters.maxWeight}
          onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => handleSortChange('name')}
          style={{
            padding: '8px 16px',
            backgroundColor: sortConfig.field === 'name' ? '#1a8cff' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sort by Name {sortConfig.field === 'name' && (sortConfig.order === 'ASC' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSortChange('weight')}
          style={{
            padding: '8px 16px',
            backgroundColor: sortConfig.field === 'weight' ? '#1a8cff' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sort by Weight {sortConfig.field === 'weight' && (sortConfig.order === 'ASC' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSortChange('createdAt')}
          style={{
            padding: '8px 16px',
            backgroundColor: sortConfig.field === 'createdAt' ? '#1a8cff' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sort by Date {sortConfig.field === 'createdAt' && (sortConfig.order === 'ASC' ? '↑' : '↓')}
        </button>
      </div>
    </div>
  );
}; 