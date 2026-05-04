interface BHKChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const BHKChip = ({ label, active = false, onClick }: BHKChipProps) => (
  <button
    onClick={onClick}
    className={`py-2 border rounded-lg text-body-sm transition-all ${
      active
        ? 'border-primary bg-primary-fixed text-primary font-semibold'
        : 'border-outline-variant hover:border-primary hover:text-primary'
    }`}
  >
    {label}
  </button>
);

export default BHKChip;
