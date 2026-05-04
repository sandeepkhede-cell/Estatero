interface ChatFABProps {
  onClick?: () => void;
}

const ChatFAB = ({ onClick }: ChatFABProps) => (
  <>
    {/* Desktop */}
    <button
      onClick={onClick}
      className="hidden sm:flex fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
    >
      <span className="material-symbols-outlined">chat</span>
    </button>

    {/* Mobile — sits above MobileNav */}
    <button
      onClick={onClick}
      className="sm:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
    >
      <span className="material-symbols-outlined">chat</span>
    </button>
  </>
);

export default ChatFAB;
