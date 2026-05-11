const AMENITIES = [
  { icon: 'pool',                  label: 'Swimming Pool' },
  { icon: 'fitness_center',        label: 'Modern Gym' },
  { icon: 'local_parking',         label: 'Car Parking' },
  { icon: 'security',              label: '24/7 Security' },
  { icon: 'elevator',              label: 'Elevator' },
  { icon: 'wifi',                  label: 'High-Speed Wi-Fi' },
  { icon: 'ac_unit',               label: 'Air Conditioning' },
  { icon: 'yard',                  label: 'Garden / Lawn' },
  { icon: 'sports_tennis',         label: 'Club House' },
  { icon: 'bolt',                  label: 'Power Backup' },
  { icon: 'local_laundry_service', label: 'Laundry Room' },
  { icon: 'child_care',            label: 'Children Play Area' },
];

interface Props {
  selected?: string[];
  onChange:  (values: string[]) => void;
}

const AmenitiesFilter = ({ selected = [], onChange }: Props) => {
  const toggle = (label: string) => {
    const next = selected.includes(label)
      ? selected.filter((s) => s !== label)
      : [...selected, label];
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {AMENITIES.map(({ icon, label }) => {
        const active = selected.includes(label);
        return (
          <button
            key={label}
            onClick={() => toggle(label)}
            className={[
              'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors',
              active
                ? 'bg-primary text-white border-primary'
                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[13px]">{icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default AmenitiesFilter;
