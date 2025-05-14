interface BackpackCardProps {
  backpack: Backpack;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

interface BackpackFormProps {
  initialData?: Partial<BackpackFormData>;
  onSubmit: (data: BackpackFormData) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

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

interface LabelProps {
    text: string;
    labelFor: string;
    children?: ReactNode | ReactNode[];
}