import { PostPropertyForm } from '../types';

const PROPERTY_TYPES = [
  { value: 'apartment',     label: 'Apartment',      icon: 'apartment' },
  { value: 'villa',         label: 'Villa',           icon: 'home' },
  { value: 'builder_floor', label: 'Builder Floor',   icon: 'layers' },
  { value: 'plot',          label: 'Plot / Land',     icon: 'landscape' },
  { value: 'commercial',    label: 'Commercial',      icon: 'store' },
  { value: 'penthouse',     label: 'Penthouse',       icon: 'roofing' },
] as const;

const LISTING_TYPES = [
  { value: 'for_sale', label: 'Sale' },
  { value: 'for_rent', label: 'Rent' },
  { value: 'pg',       label: 'PG / Co-living' },
] as const;

interface Props {
  form: PostPropertyForm;
  onChange: (patch: Partial<PostPropertyForm>) => void;
}

const Step1Type = ({ form, onChange }: Props) => (
  <div className="space-y-8">
    <div>
      <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">
        Property Type
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PROPERTY_TYPES.map(({ value, label, icon }) => {
          const active = form.propertyType === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ propertyType: value })}
              className={[
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                active
                  ? 'border-primary bg-primary-fixed text-primary'
                  : 'border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant',
              ].join(' ')}
            >
              <span className="material-symbols-outlined text-[28px]">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>

    <div>
      <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">
        Listed For
      </h3>
      <div className="flex gap-3">
        {LISTING_TYPES.map(({ value, label }) => {
          const active = form.listingType === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ listingType: value })}
              className={[
                'flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant',
              ].join(' ')}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

export default Step1Type;
