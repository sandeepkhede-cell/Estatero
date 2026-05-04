import { ReactNode } from 'react';

interface SearchFieldProps {
  icon: string;
  label: string;
  children: ReactNode;
}

const SearchField = ({ icon, label, children }: SearchFieldProps) => (
  <div className="flex-1 w-full">
    <div className="flex items-center px-4 py-3 bg-surface-container-low rounded-lg border border-transparent focus-within:border-primary-container transition-all">
      <span className="material-symbols-outlined text-primary mr-2">{icon}</span>
      <div className="text-left w-full">
        <p className="text-[10px] font-bold uppercase text-outline tracking-wider leading-none mb-1">
          {label}
        </p>
        {children}
      </div>
    </div>
  </div>
);

export default SearchField;
