const OPTIONS = ['0-1 year', '1-5 years', '5-10 years', '10+ years'];

interface AgeFilterProps {
  selected?: string;
  onChange?: (value: string | undefined) => void;
}

const AgeFilter = ({ selected, onChange }: AgeFilterProps) => (
  <div className="space-y-2">
    {OPTIONS.map((opt) => (
      <label key={opt} className="flex items-center gap-2 cursor-pointer group">
        <input
          type="radio"
          name="ageOfProperty"
          checked={selected === opt}
          onChange={() => onChange?.(selected === opt ? undefined : opt)}
          className="text-primary focus:ring-primary h-4 w-4"
        />
        <span className="text-body-sm text-on-surface group-hover:text-primary transition-colors">
          {opt}
        </span>
      </label>
    ))}
  </div>
);

export default AgeFilter;
