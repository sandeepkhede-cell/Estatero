import type { AvailabilityType } from '../../types/property';

const OPTIONS: { value: AvailabilityType; label: string }[] = [
  { value: 'ready-to-move',       label: 'Ready to Move' },
  { value: 'under-construction',  label: 'Under Construction' },
];

interface AvailabilityFilterProps {
  selected?: AvailabilityType;
  onChange?: (value: AvailabilityType | undefined) => void;
}

const AvailabilityFilter = ({ selected, onChange }: AvailabilityFilterProps) => (
  <div className="space-y-2">
    {OPTIONS.map(({ value, label }) => (
      <label key={value} className="flex items-center gap-2 cursor-pointer group">
        <input
          type="radio"
          name="availability"
          checked={selected === value}
          onChange={() => onChange?.(selected === value ? undefined : value)}
          className="text-primary focus:ring-primary h-4 w-4"
        />
        <span className="text-body-sm text-on-surface group-hover:text-primary transition-colors">
          {label}
        </span>
      </label>
    ))}
  </div>
);

export default AvailabilityFilter;
