interface CheckboxItemProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckboxItem = ({ label, checked = false, onChange }: CheckboxItemProps) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className="rounded border-outline text-primary focus:ring-primary h-4 w-4"
    />
    <span className="text-body-sm text-on-surface group-hover:text-primary transition-colors">
      {label}
    </span>
  </label>
);

export default CheckboxItem;
