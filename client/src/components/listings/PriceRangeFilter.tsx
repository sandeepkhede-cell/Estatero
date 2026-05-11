import { FilterState } from '../../types/search';

// Price steps in rupees: 0, 10L, 20L … 1Cr, 2Cr … 10Cr
const STEPS: number[] = [
  0,
  1_000_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000,
  7_500_000, 10_000_000, 15_000_000, 20_000_000,
  30_000_000, 50_000_000, 75_000_000, 100_000_000,
];

function label(v: number): string {
  if (v === 0) return 'No Min';
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(v % 1_00_00_000 === 0 ? 0 : 1)} Cr`;
  return `₹${(v / 1_00_000).toFixed(v % 1_00_000 === 0 ? 0 : 1)} L`;
}

const MAX_SENTINEL = STEPS[STEPS.length - 1] + 1; // means "no max"

interface Props {
  minPrice?: number;
  maxPrice?: number;
  // legacy scalar (0-100 slider) — still accepted so existing filters don't break
  value?:    number;
  onChange:  (patch: Partial<Pick<FilterState, 'minPrice' | 'maxPrice' | 'priceRange'>>) => void;
}

const PriceRangeFilter = ({ minPrice, maxPrice, onChange }: Props) => {
  const minIdx = minPrice ? STEPS.findIndex((s) => s >= minPrice) : 0;
  const resolvedMin = Math.max(0, minIdx === -1 ? STEPS.length - 1 : minIdx);

  const maxIdx = maxPrice ? STEPS.findIndex((s) => s >= maxPrice) : STEPS.length;
  const resolvedMax = maxIdx === -1 ? STEPS.length : maxIdx;

  const handleMin = (idx: number) => {
    const val = STEPS[idx];
    onChange({ minPrice: val === 0 ? undefined : val, priceRange: 100 });
    // if min exceeds current max, push max up
    if (maxPrice && val >= maxPrice) {
      const nextMax = STEPS[Math.min(idx + 1, STEPS.length - 1)];
      onChange({ minPrice: val === 0 ? undefined : val, maxPrice: nextMax, priceRange: 100 });
    }
  };

  const handleMax = (idx: number) => {
    if (idx >= STEPS.length) {
      onChange({ maxPrice: undefined, priceRange: 100 });
    } else {
      const val = STEPS[idx];
      onChange({ maxPrice: val, priceRange: 100 });
      if (minPrice && val <= minPrice) {
        const prevMin = STEPS[Math.max(idx - 1, 0)];
        onChange({ minPrice: prevMin === 0 ? undefined : prevMin, maxPrice: val, priceRange: 100 });
      }
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">Min Price</p>
        <select
          value={resolvedMin}
          onChange={(e) => handleMin(Number(e.target.value))}
          className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {STEPS.map((s, i) => (
            <option key={i} value={i}>{label(s)}</option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">Max Price</p>
        <select
          value={resolvedMax}
          onChange={(e) => handleMax(Number(e.target.value))}
          className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {STEPS.map((s, i) => (
            <option key={i} value={i}>{label(s)}</option>
          ))}
          <option value={STEPS.length}>No Max</option>
        </select>
      </div>
      {(minPrice || maxPrice) && (
        <p className="text-xs text-primary font-semibold">
          {minPrice ? label(minPrice) : '₹0'} — {maxPrice ? label(maxPrice) : 'Any'}
        </p>
      )}
    </div>
  );
};

export default PriceRangeFilter;
