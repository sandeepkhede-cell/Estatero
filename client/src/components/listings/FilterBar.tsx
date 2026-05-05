import { FilterState } from '../../types/search';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

type Pill = {
  label: string;
  active: boolean;
  onToggle: () => void;
};

const Pill = ({ label, active, onToggle }: Pill) => (
  <button
    onClick={onToggle}
    className={[
      'whitespace-nowrap border px-4 py-1.5 rounded-full text-body-sm font-medium transition-all',
      active
        ? 'bg-primary text-white border-primary'
        : 'bg-white border-outline-variant text-on-surface hover:border-primary hover:text-primary',
    ].join(' ')}
  >
    {label}
  </button>
);

const STATUS_PILLS = [
  { label: 'Buy',  value: 'for_sale' },
  { label: 'Rent', value: 'for_rent' },
  { label: 'PG',   value: 'pg' },
] as const;

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const toggleStatus = (val: FilterState['status']) => {
    onFilterChange('status', filters.status === val ? undefined : val);
  };

  const hasFurnished = filters.furnishing?.includes('fully-furnished');
  const toggleFurnished = () =>
    onFilterChange(
      'furnishing',
      hasFurnished
        ? (filters.furnishing ?? []).filter((f) => f !== 'fully-furnished')
        : [...(filters.furnishing ?? []), 'fully-furnished'],
    );

  const isReadyToMove = filters.availability === 'ready-to-move';
  const toggleRTM = () =>
    onFilterChange('availability', isReadyToMove ? undefined : 'ready-to-move');

  const isReraFilter = false; // placeholder — backend filter not wired yet

  return (
    <div className="sticky top-[61px] z-40 bg-white border-b border-outline-variant overflow-x-auto px-6 py-2.5 flex items-center gap-2">
      <span className="material-symbols-outlined text-on-surface-variant text-[18px] flex-shrink-0">tune</span>

      {/* Status */}
      {STATUS_PILLS.map(({ label, value }) => (
        <Pill
          key={value}
          label={label}
          active={filters.status === value}
          onToggle={() => toggleStatus(value)}
        />
      ))}

      <div className="h-5 w-px bg-outline-variant mx-1 flex-shrink-0" />

      {/* Quick attribute filters */}
      <Pill label="Ready to Move" active={isReadyToMove} onToggle={toggleRTM} />
      <Pill label="Fully Furnished" active={!!hasFurnished} onToggle={toggleFurnished} />
      <Pill label="RERA Verified"   active={isReraFilter}  onToggle={() => {}} />
    </div>
  );
};

export default FilterBar;
