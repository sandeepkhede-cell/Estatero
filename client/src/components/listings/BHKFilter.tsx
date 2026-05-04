import BHKChip from '../ui/BHKChip';

interface BHKFilterProps {
  options?: string[];
  selected?: string[];
  onChange?: (selected: string[]) => void;
}

const defaultOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

const BHKFilter = ({
  options = defaultOptions,
  selected = [],
  onChange,
}: BHKFilterProps) => {
  const toggle = (bhk: string) => {
    const next = selected.includes(bhk)
      ? selected.filter((b) => b !== bhk)
      : [...selected, bhk];
    onChange?.(next);
  };

  return (
    <div>
      <p className="font-label-bold text-label-bold uppercase tracking-wider text-outline mb-sm">
        BHK
      </p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((bhk) => (
          <BHKChip
            key={bhk}
            label={bhk}
            active={selected.includes(bhk)}
            onClick={() => toggle(bhk)}
          />
        ))}
      </div>
    </div>
  );
};

export default BHKFilter;
