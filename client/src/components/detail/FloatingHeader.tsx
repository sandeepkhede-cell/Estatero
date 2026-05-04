interface FloatingHeaderProps {
  onBack?: () => void;
  onFavourite?: () => void;
  onShare?: () => void;
  isFavourited?: boolean;
}

const FloatingHeader = ({ onBack, onFavourite, onShare, isFavourited }: FloatingHeaderProps) => (
  <header className="fixed top-0 left-0 w-full z-50 px-4 py-4 flex justify-between items-center pointer-events-none">
    <button
      onClick={onBack}
      className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-on-surface pointer-events-auto active:scale-95 transition-transform"
    >
      <span className="material-symbols-outlined">arrow_back</span>
    </button>

    <div className="flex gap-2 pointer-events-auto">
      <button
        onClick={onFavourite}
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-on-surface active:scale-95 transition-transform"
      >
        <span
          className="material-symbols-outlined"
          style={isFavourited ? { fontVariationSettings: "'FILL' 1", color: '#a700ad' } : {}}
        >
          favorite
        </span>
      </button>
      <button
        onClick={onShare}
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-on-surface active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined">share</span>
      </button>
    </div>
  </header>
);

export default FloatingHeader;
