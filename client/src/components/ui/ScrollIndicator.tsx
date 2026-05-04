interface ScrollIndicatorProps {
  total: number;
  active: number;
}

const ScrollIndicator = ({ total, active }: ScrollIndicatorProps) => (
  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
    {Array.from({ length: total }).map((_, idx) => (
      <div
        key={idx}
        className={`rounded-full bg-white transition-all ${
          idx === active ? 'w-1.5 h-6' : 'w-1.5 h-1.5 opacity-60'
        }`}
      />
    ))}
  </div>
);

export default ScrollIndicator;
