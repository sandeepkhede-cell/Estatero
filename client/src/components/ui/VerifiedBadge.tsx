interface VerifiedBadgeProps {
  variant?: 'card' | 'detail';
}

const VerifiedBadge = ({ variant = 'card' }: VerifiedBadgeProps) => {
  if (variant === 'detail') {
    return (
      <div className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-lg font-label-bold text-label-bold flex items-center gap-1 shadow-md">
        <span
          className="material-symbols-outlined text-[16px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified
        </span>
        Verified Property
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
      <span className="material-symbols-outlined text-green-600 text-[18px]">verified</span>
      <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface">Verified</span>
    </div>
  );
};

export default VerifiedBadge;
