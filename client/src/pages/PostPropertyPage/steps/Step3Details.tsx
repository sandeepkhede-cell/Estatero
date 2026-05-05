import { PostPropertyForm } from '../types';

interface Props {
  form: PostPropertyForm;
  onChange: (patch: Partial<PostPropertyForm>) => void;
}

const inputCls = 'w-full border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

function ChipRow<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={[
            'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
            selected === value
              ? 'border-primary bg-primary-fixed text-primary'
              : 'border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const BHK_OPTIONS = ['1','2','3','4','5','6'].map((v) => ({ value: v, label: `${v} BHK` }));
const BATH_OPTIONS = ['1','2','3','4'].map((v) => ({ value: v, label: v }));
const FURNISHING_OPTIONS = [
  { value: 'unfurnished',     label: 'Unfurnished' },
  { value: 'semi-furnished',  label: 'Semi-Furnished' },
  { value: 'fully-furnished', label: 'Fully Furnished' },
];
const AVAILABILITY_OPTIONS = [
  { value: 'ready-to-move',      label: 'Ready to Move' },
  { value: 'under-construction', label: 'Under Construction' },
];
const AGE_OPTIONS = [
  { value: '0-1 year',   label: 'New (< 1 yr)' },
  { value: '1-5 years',  label: '1–5 yrs' },
  { value: '5-10 years', label: '5–10 yrs' },
  { value: '10+ years',  label: '10+ yrs' },
];
const FACING_OPTIONS = ['East','West','North','South','North-East','North-West','South-East','South-West'].map(
  (v) => ({ value: v, label: v }),
);

const Step3Details = ({ form, onChange }: Props) => (
  <div className="space-y-6">
    <Field label="Bedrooms">
      <ChipRow
        options={BHK_OPTIONS}
        selected={form.bedrooms}
        onSelect={(v) => onChange({ bedrooms: v })}
      />
    </Field>

    <Field label="Bathrooms">
      <ChipRow
        options={BATH_OPTIONS}
        selected={form.bathrooms}
        onSelect={(v) => onChange({ bathrooms: v })}
      />
    </Field>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <Field label="Total Area (sq.ft) *">
        <input
          type="number"
          value={form.area_sqft}
          onChange={(e) => onChange({ area_sqft: e.target.value })}
          placeholder="e.g. 1200"
          className={inputCls}
          min={0}
        />
      </Field>
      <Field label="Floor No.">
        <input
          type="number"
          value={form.floor}
          onChange={(e) => onChange({ floor: e.target.value })}
          placeholder="e.g. 5"
          className={inputCls}
          min={0}
        />
      </Field>
      <Field label="Total Floors">
        <input
          type="number"
          value={form.total_floors}
          onChange={(e) => onChange({ total_floors: e.target.value })}
          placeholder="e.g. 12"
          className={inputCls}
          min={0}
        />
      </Field>
    </div>

    <Field label="Furnishing">
      <ChipRow
        options={FURNISHING_OPTIONS}
        selected={form.furnishing}
        onSelect={(v) => onChange({ furnishing: v })}
      />
    </Field>

    <Field label="Availability">
      <ChipRow
        options={AVAILABILITY_OPTIONS}
        selected={form.availability}
        onSelect={(v) => onChange({ availability: v })}
      />
    </Field>

    <Field label="Age of Property">
      <ChipRow
        options={AGE_OPTIONS}
        selected={form.age_of_property}
        onSelect={(v) => onChange({ age_of_property: v })}
      />
    </Field>

    <Field label="Facing">
      <ChipRow
        options={FACING_OPTIONS}
        selected={form.facing}
        onSelect={(v) => onChange({ facing: v })}
      />
    </Field>
  </div>
);

export default Step3Details;
