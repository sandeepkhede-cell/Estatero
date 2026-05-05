import { PostPropertyForm } from '../types';

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune',
  'Chennai', 'Kolkata', 'Noida', 'Gurugram', 'Ahmedabad',
];

const STATES = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu',
  'West Bengal', 'Uttar Pradesh', 'Haryana', 'Gujarat', 'Rajasthan',
];

interface Props {
  form: PostPropertyForm;
  onChange: (patch: Partial<PostPropertyForm>) => void;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const inputCls = 'w-full border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white';

const Step2Location = ({ form, onChange }: Props) => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="City *">
        <select
          value={form.city}
          onChange={(e) => onChange({ city: e.target.value })}
          className={inputCls}
        >
          <option value="">Select city</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="State">
        <select
          value={form.state}
          onChange={(e) => onChange({ state: e.target.value })}
          className={inputCls}
        >
          <option value="">Select state</option>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
    </div>

    <Field label="Locality / Address *">
      <input
        type="text"
        value={form.location}
        onChange={(e) => onChange({ location: e.target.value })}
        placeholder="e.g. Bandra West, Linking Road"
        className={inputCls}
      />
    </Field>

    <div className="bg-surface-container-low rounded-xl p-4 flex items-start gap-3">
      <span className="material-symbols-outlined text-primary mt-0.5">info</span>
      <p className="text-body-sm text-on-surface-variant">
        A precise locality helps buyers find your property faster. Avoid vague descriptions.
      </p>
    </div>
  </div>
);

export default Step2Location;
