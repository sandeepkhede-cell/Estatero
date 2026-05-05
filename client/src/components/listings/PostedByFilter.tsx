type PostedBy = 'owner' | 'agent' | 'builder';

const OPTIONS: { value: PostedBy; label: string }[] = [
  { value: 'owner',   label: 'Owner' },
  { value: 'agent',   label: 'Agent' },
  { value: 'builder', label: 'Builder' },
];

interface PostedByFilterProps {
  selected?: PostedBy;
  onChange?: (value: PostedBy | undefined) => void;
}

const PostedByFilter = ({ selected, onChange }: PostedByFilterProps) => (
  <div className="space-y-2">
    {OPTIONS.map(({ value, label }) => (
      <label key={value} className="flex items-center gap-2 cursor-pointer group">
        <input
          type="radio"
          name="postedBy"
          checked={selected === value}
          onChange={() => onChange?.(selected === value ? undefined : value)}
          className="text-primary focus:ring-primary h-4 w-4"
        />
        <span className="text-body-sm text-on-surface group-hover:text-primary transition-colors">
          {label}
        </span>
      </label>
    ))}
  </div>
);

export default PostedByFilter;
