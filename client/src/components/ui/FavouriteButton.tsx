import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';

interface FavouriteButtonProps {
  isFavourited?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

const sizes = {
  sm: 'w-8 h-8 text-[20px]',
  md: 'w-10 h-10 text-[24px]',
};

const FavouriteButton = ({ isFavourited = false, size = 'md', onClick }: FavouriteButtonProps) => {
  const { user } = useAuth();
  const { open } = useAuthModal();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { open('login'); return; }
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      title={user ? (isFavourited ? 'Remove from saved' : 'Save property') : 'Sign in to save'}
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
};

export default FavouriteButton;
