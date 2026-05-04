interface PriceRangeFilterProps {
  value?: number;
  onChange?: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
}

const PriceRangeFilter = ({
  value = 50,
  onChange,
  minLabel = '₹0',
  maxLabel = '₹10Cr+',
}: PriceRangeFilterProps) => (
  <div>
    <p className="font-label-bold text-label-bold uppercase tracking-wider text-outline mb-sm">
      Price Range
    </p>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
      className="w-full accent-primary"
    />
    <div className="flex justify-between mt-2 text-body-sm text-on-surface-variant">
      <span>{minLabel}</span>
      <span>{maxLabel}</span>
    </div>
  </div>
);

export default PriceRangeFilter;
