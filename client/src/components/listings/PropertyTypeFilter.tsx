import CheckboxItem from '../ui/CheckboxItem';

interface PropertyTypeFilterProps {
  types?: string[];
  selected?: string[];
  onChange?: (selected: string[]) => void;
}

const defaultTypes = ['Apartment', 'Independent House', 'Villa', 'Plot'];

const PropertyTypeFilter = ({
  types = defaultTypes,
  selected = [],
  onChange,
}: PropertyTypeFilterProps) => {
  const toggle = (type: string) => {
    const next = selected.includes(type)
      ? selected.filter((t) => t !== type)
      : [...selected, type];
    onChange?.(next);
  };

  return (
    <div>
      <p className="font-label-bold text-label-bold uppercase tracking-wider text-outline mb-sm">
        Property Type
      </p>
      <div className="space-y-2">
        {types.map((type) => (
          <CheckboxItem
            key={type}
            label={type}
            checked={selected.includes(type)}
            onChange={() => toggle(type)}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyTypeFilter;
