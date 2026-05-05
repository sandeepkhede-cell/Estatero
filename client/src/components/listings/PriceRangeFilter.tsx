interface PriceRangeFilterProps {
  value?: number;
  onChange?: (value: number) => void;
}

function sliderLabel(v: number): string {
  if (v >= 100) return 'Any';
  const rupees = v * 1_000_000;
  if (rupees >= 1_00_00_000) return `Up to ₹${(rupees / 1_00_00_000).toFixed(1)} Cr`;
  return `Up to ₹${(rupees / 1_00_000).toFixed(0)} L`;
}

const PriceRangeFilter = ({ value = 100, onChange }: PriceRangeFilterProps) => (
  <div>
    <div className="flex items-center justify-between mb-sm">
      <p className="font-label-bold text-label-bold uppercase tracking-wider text-outline">
        Price Range
      </p>
      <span className="text-body-sm font-semibold text-primary">{sliderLabel(value)}</span>
    </div>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
      className="w-full accent-primary"
    />
    <div className="flex justify-between mt-1 text-body-sm text-on-surface-variant">
      <span>₹0</span>
      <span>₹10Cr+</span>
    </div>
  </div>
);

export default PriceRangeFilter;
