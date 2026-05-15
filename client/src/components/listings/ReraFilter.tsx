interface ReraFilterProps {
  selected?: boolean;
  onChange:  (value: boolean | undefined) => void;
}

const ReraFilter = ({ selected, onChange }: ReraFilterProps) => (
  <button
    type="button"
    onClick={() => onChange(selected ? undefined : true)}
    className={[
      'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border text-left transition-all text-sm',
      selected
        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
        : 'border-gray-200 text-gray-600 hover:border-emerald-400',
    ].join(' ')}
  >
    <span className="material-symbols-outlined text-[18px]">verified_user</span>
    <span>RERA Registered Only</span>
    {selected && <span className="ml-auto material-symbols-outlined text-[16px]">check_circle</span>}
  </button>
);

export default ReraFilter;
