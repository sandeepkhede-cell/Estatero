interface BadgeLabelProps {
  label: string;
  variant?: 'primary' | 'secondary';
}

const variantClasses = {
  primary: 'bg-primary-fixed text-on-primary-fixed',
  secondary: 'bg-secondary-container text-on-secondary-container',
};

const BadgeLabel = ({ label, variant = 'primary' }: BadgeLabelProps) => (
  <span className={`${variantClasses[variant]} px-3 py-1 rounded-lg font-label-bold text-xs`}>
    {label}
  </span>
);

export default BadgeLabel;
