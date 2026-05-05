import { PostPropertyForm } from '../types';
import { formatINR } from '../../../utils/formatINR';

interface Props {
  form: PostPropertyForm;
  onChange: (patch: Partial<PostPropertyForm>) => void;
  submitting: boolean;
  error: string | null;
}

const inputCls = 'w-full border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white';

const Row = ({ label, value }: { label: string; value: string | undefined }) =>
  value ? (
    <div className="flex justify-between py-2 border-b border-outline-variant last:border-0">
      <span className="text-xs text-on-surface-variant">{label}</span>
      <span className="text-sm font-medium text-on-surface text-right max-w-[60%]">{value}</span>
    </div>
  ) : null;

const Step7Review = ({ form, onChange, submitting, error }: Props) => {
  const price = Number(form.price) || 0;

  return (
    <div className="space-y-6">
      {/* Editable title & description */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Listing Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. 3 BHK Apartment in Bandra West"
            className={inputCls}
            maxLength={200}
          />
          <p className="text-[11px] text-outline mt-1">{form.title.length} / 200</p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe the property — highlights, nearby landmarks, society features..."
            className={`${inputCls} resize-none`}
            rows={4}
            maxLength={1000}
          />
          <p className="text-[11px] text-outline mt-1">{form.description.length} / 1000</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-surface-container-low rounded-xl p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
          Summary
        </p>
        <Row label="Property Type"  value={form.propertyType.replace(/_/g, ' ')} />
        <Row label="Listed For"     value={{ for_sale: 'Sale', for_rent: 'Rent', pg: 'PG' }[form.listingType]} />
        <Row label="City"           value={form.city} />
        <Row label="Locality"       value={form.location} />
        <Row label="Bedrooms"       value={form.bedrooms ? `${form.bedrooms} BHK` : undefined} />
        <Row label="Area"           value={form.area_sqft ? `${form.area_sqft} sq.ft` : undefined} />
        <Row label="Furnishing"     value={form.furnishing || undefined} />
        <Row label="Availability"   value={form.availability || undefined} />
        <Row label="Price"          value={price > 0 ? formatINR(price) : undefined} />
        <Row label="RERA"           value={form.rera_registered ? `Registered${form.rera_number ? ` · ${form.rera_number}` : ''}` : 'Not Registered'} />
        <Row label="Amenities"      value={form.amenities.length > 0 ? form.amenities.join(', ') : undefined} />
        <Row label="Photos"         value={form.imageUrls.length > 0 ? `${form.imageUrls.length} uploaded` : undefined} />
      </div>

      {/* Cover image preview */}
      {form.imageUrls[0] && (
        <div className="rounded-xl overflow-hidden aspect-video bg-surface-container">
          <img src={form.imageUrls[0]} alt="Cover" className="w-full h-full object-cover" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-red-700">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      {submitting && (
        <div className="flex items-center gap-3 text-on-surface-variant text-sm">
          <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
          Publishing your listing...
        </div>
      )}
    </div>
  );
};

export default Step7Review;
