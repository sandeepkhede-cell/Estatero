import { PostPropertyForm } from '../types';
import { formatINR } from '../../../utils/formatINR';

interface Props {
  form: PostPropertyForm;
  onChange: (patch: Partial<PostPropertyForm>) => void;
  userRole?: string;
}

const inputCls = 'w-full border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white';

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-outline mt-1">{hint}</p>}
  </div>
);

function Toggle({ label, description, value, onToggle }: { label: string; description: string; value: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={[
          'relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          value ? 'bg-primary' : 'bg-surface-container-high',
        ].join(' ')}
      >
        <span className={[
          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
          value ? 'translate-x-5' : '',
        ].join(' ')} />
      </button>
    </div>
  );
}

const Step4Pricing = ({ form, onChange, userRole }: Props) => {
  const price = Number(form.price) || 0;
  const area  = Number(form.area_sqft) || 0;
  const autoPerSqft = area > 0 && price > 0 ? Math.round(price / area) : 0;

  return (
    <div className="space-y-6">
      <Field label="Sale / Rent Price (₹) *" hint={price > 0 ? formatINR(price) : undefined}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">₹</span>
          <input
            type="number"
            value={form.price}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder="e.g. 7500000"
            className={`${inputCls} pl-8`}
            min={0}
          />
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          label="Price per sq.ft (₹)"
          hint={autoPerSqft > 0 && !form.price_per_sqft ? `Auto: ₹${autoPerSqft.toLocaleString('en-IN')}/sqft` : undefined}
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">₹</span>
            <input
              type="number"
              value={form.price_per_sqft}
              onChange={(e) => onChange({ price_per_sqft: e.target.value })}
              placeholder={autoPerSqft > 0 ? String(autoPerSqft) : 'e.g. 6250'}
              className={`${inputCls} pl-8`}
              min={0}
            />
          </div>
        </Field>

        <Field label="Monthly EMI (₹)" hint="Optional — helps buyers plan finance">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">₹</span>
            <input
              type="number"
              value={form.emi}
              onChange={(e) => onChange({ emi: e.target.value })}
              placeholder="e.g. 42000"
              className={`${inputCls} pl-8`}
              min={0}
            />
          </div>
        </Field>
      </div>

      <div className="border border-outline-variant rounded-xl p-5 space-y-4">
        <Toggle
          label="RERA Registered"
          description="Builds buyer trust and is legally required in many states"
          value={form.rera_registered}
          onToggle={() => onChange({ rera_registered: !form.rera_registered })}
        />

        {form.rera_registered && (
          <Field label="RERA Number">
            <input
              type="text"
              value={form.rera_number}
              onChange={(e) => onChange({ rera_number: e.target.value })}
              placeholder="e.g. P51800012345"
              className={inputCls}
            />
          </Field>
        )}

        {/* Owner Direct — only for owner role */}
        {userRole === 'owner' && (
          <>
            <div className="border-t border-outline-variant pt-4" />
            <Toggle
              label="Owner Direct"
              description="No broker or agent involved — buyers contact you directly"
              value={form.is_owner_direct}
              onToggle={() => onChange({ is_owner_direct: !form.is_owner_direct })}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Step4Pricing;
