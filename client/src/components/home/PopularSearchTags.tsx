import { usePopularSearches } from '../../hooks/usePopularSearches';

interface PopularSearchTagsProps {
  label?: string;
  tags?: string[];
  onTagClick?: (tag: string) => void;
}

const PopularSearchTags = ({
  label = 'Popular:',
  tags,
  onTagClick,
}: PopularSearchTagsProps) => {
  const { popular: fetched } = usePopularSearches();
  const items = tags ?? fetched;

  if (items.length === 0) return null;

  return (
    <div className="mt-lg flex flex-wrap justify-center gap-sm">
      <span className="text-white font-label-bold mr-2 self-center">{label}</span>
      {items.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className="bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-primary transition-all px-4 py-1.5 rounded-full text-body-sm font-medium"
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default PopularSearchTags;
