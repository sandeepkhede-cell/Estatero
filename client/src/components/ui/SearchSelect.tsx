import { useState, useRef, useEffect } from 'react';

interface SearchSelectProps {
  icon: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const SearchSelect = ({ icon, label, value, options, onChange }: SearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative flex-1 w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          'w-full flex items-center px-4 py-3 bg-surface-container-low rounded-lg border transition-all text-left',
          open ? 'border-primary-container' : 'border-transparent hover:border-primary-container/50',
        ].join(' ')}
      >
        <span className="material-symbols-outlined text-primary mr-2 flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase text-outline tracking-wider leading-none mb-1">
            {label}
          </p>
          <p className="font-label-bold text-on-surface truncate text-sm">{value}</p>
        </div>
        <span
          className={`material-symbols-outlined text-outline text-[18px] flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => select(option)}
              className={[
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors',
                option === value
                  ? 'bg-primary-fixed text-primary font-semibold'
                  : 'text-on-surface hover:bg-surface-container-low',
              ].join(' ')}
            >
              {option === value && (
                <span className="material-symbols-outlined text-primary text-[16px]">check</span>
              )}
              {option !== value && <span className="w-4" />}
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
