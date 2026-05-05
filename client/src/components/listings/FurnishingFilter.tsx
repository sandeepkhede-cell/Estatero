import CheckboxItem from '../ui/CheckboxItem';
import type { FurnishingType } from '../../types/property';

const OPTIONS: { value: FurnishingType; label: string }[] = [
  { value: 'unfurnished',     label: 'Unfurnished' },
  { value: 'semi-furnished',  label: 'Semi-Furnished' },
  { value: 'fully-furnished', label: 'Fully Furnished' },
];

interface FurnishingFilterProps {
  selected?: FurnishingType[];
  onChange?: (selected: FurnishingType[]) => void;
}

const FurnishingFilter = ({ selected = [], onChange }: FurnishingFilterProps) => {
  const toggle = (val: FurnishingType) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    onChange?.(next);
  };

  return (
    <div className="space-y-2">
      {OPTIONS.map(({ value, label }) => (
        <CheckboxItem
          key={value}
          label={label}
          checked={selected.includes(value)}
          onChange={() => toggle(value)}
        />
      ))}
    </div>
  );
};

export default FurnishingFilter;
