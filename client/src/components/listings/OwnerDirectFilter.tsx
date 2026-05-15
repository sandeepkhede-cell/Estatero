interface OwnerDirectFilterProps {
  selected?: boolean;
  onChange:  (value: boolean | undefined) => void;
}

const OwnerDirectFilter = ({ selected, onChange }: OwnerDirectFilterProps) => (
  <button
    type="button"
    onClick={() => onChange(selected ? undefined : true)}
    className={[
      'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border text-left transition-all text-sm',
      selected
        ? 'border-amber-500 bg-amber-50 text-amber-700 font-semibold'
        : 'border-gray-200 text-gray-600 hover:border-amber-400',
    ].join(' ')}
  >
    <span className="material-symbols-outlined text-[18px]">handshake</span>
    <span>Owner Direct — No Brokerage</span>
    {selected && <span className="ml-auto material-symbols-outlined text-[16px]">check_circle</span>}
  </button>
);

export default OwnerDirectFilter;
