interface BottomActionBarProps {
  onInquiry?: () => void;
  onContactAgent?: () => void;
  showNumber?: boolean;
  agentPhone?: string;
}

const BottomActionBar = ({ onInquiry, onContactAgent, showNumber, agentPhone }: BottomActionBarProps) => (
  <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-outline-variant p-4 flex gap-3 items-center z-50">
    <button
      onClick={onInquiry}
      className="flex-[1] h-14 rounded-xl border-2 border-primary text-primary font-h3 text-[16px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
    >
      <span className="material-symbols-outlined">chat</span>
      Enquiry
    </button>
    {agentPhone ? (
      <button
        onClick={onContactAgent}
        className="flex-[2] h-14 rounded-xl bg-primary text-on-primary font-h3 text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          {showNumber ? 'call' : 'person'}
        </span>
        {showNumber ? agentPhone : 'Contact Agent'}
      </button>
    ) : (
      <button
        onClick={onInquiry}
        className="flex-[2] h-14 rounded-xl bg-primary text-on-primary font-h3 text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined">chat</span>
        Send Enquiry
      </button>
    )}
  </div>
);

export default BottomActionBar;
