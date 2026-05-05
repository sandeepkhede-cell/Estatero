import { useState } from 'react';

interface FilterSectionProps {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const FilterSection = ({ label, defaultOpen = true, children }: FilterSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-outline-variant pt-lg">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mb-sm group"
      >
        <span className="font-label-bold text-[11px] uppercase tracking-wider text-outline group-hover:text-on-surface transition-colors">
          {label}
        </span>
        <span className={`material-symbols-outlined text-[18px] text-outline transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

export default FilterSection;
