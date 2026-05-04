interface FavouriteButtonProps {
  isFavourited?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

const sizes = {
  sm: 'w-8 h-8 text-[20px]',
  md: 'w-10 h-10 text-[24px]',
};

const FavouriteButton = ({ isFavourited = false, size = 'md', onClick }: FavouriteButtonProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className={`${sizes[size]} flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-sm transition-colors`}
  >
    <span
      className="material-symbols-outlined"
      style={isFavourited ? { fontVariationSettings: "'FILL' 1", color: '#a700ad' } : { color: '#9ca3af' }}
    >
      favorite
    </span>
  </button>
);

export default FavouriteButton;
