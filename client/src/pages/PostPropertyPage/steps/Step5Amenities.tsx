import { PostPropertyForm } from '../types';

interface Props {
  form: PostPropertyForm;
  onChange: (patch: Partial<PostPropertyForm>) => void;
}

const AMENITIES: { icon: string; label: string }[] = [
  { icon: 'elevator',          label: 'Lift' },
  { icon: 'local_parking',     label: 'Parking' },
  { icon: 'fitness_center',    label: 'Gym' },
  { icon: 'pool',              label: 'Swimming Pool' },
  { icon: 'security',          label: '24/7 Security' },
  { icon: 'yard',              label: 'Garden / Park' },
  { icon: 'sports_tennis',     label: 'Club House' },
  { icon: 'bolt',              label: 'Power Backup' },
  { icon: 'water_drop',        label: '24hr Water Supply' },
  { icon: 'wifi',              label: 'High-Speed Internet' },
  { icon: 'local_fire_department', label: 'Fire Safety' },
  { icon: 'videocam',          label: 'CCTV Surveillance' },
  { icon: 'child_friendly',    label: "Children's Play Area" },
  { icon: 'ac_unit',           label: 'Air Conditioning' },
  { icon: 'local_laundry_service', label: 'Laundry Service' },
  { icon: 'directions_bus',    label: 'Shuttle Service' },
];

const Step5Amenities = ({ form, onChange }: Props) => {
  const toggle = (label: string) => {
    const next = form.amenities.includes(label)
      ? form.amenities.filter((a) => a !== label)
      : [...form.amenities, label];
    onChange({ amenities: next });
  };

  return (
    <div>
      <p className="text-body-sm text-on-surface-variant mb-5">
        Select all amenities available in your property / society.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {AMENITIES.map(({ icon, label }) => {
          const active = form.amenities.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(label)}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left',
                active
                  ? 'border-primary bg-primary-fixed text-primary'
                  : 'border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant',
              ].join(' ')}
            >
              <span className={`material-symbols-outlined text-[20px] flex-shrink-0 ${active ? 'text-primary' : 'text-outline'}`}>
                {icon}
              </span>
              <span className="leading-tight">{label}</span>
            </button>
          );
        })}
      </div>

      {form.amenities.length > 0 && (
        <p className="mt-4 text-xs text-on-surface-variant">
          {form.amenities.length} amenit{form.amenities.length === 1 ? 'y' : 'ies'} selected
        </p>
      )}
    </div>
  );
};

export default Step5Amenities;
