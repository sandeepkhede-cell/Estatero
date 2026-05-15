interface StepIndicatorProps {
  current: number; // 0-indexed
  total?:  number; // defaults to 7
}

const StepIndicator = ({ current, total = 7 }: StepIndicatorProps) => {
  const steps = Array.from({ length: total }, (_, i) => i);
  return (
    <div className="flex items-center w-full">
      {steps.map((i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors flex-shrink-0',
                done   ? 'bg-primary text-white'                       : '',
                active ? 'bg-primary text-white ring-4 ring-primary/20' : '',
                !done && !active ? 'bg-surface-container text-on-surface-variant' : '',
              ].join(' ')}>
                {done
                  ? <span className="material-symbols-outlined text-[16px]">check</span>
                  : i + 1}
              </div>
            </div>

            {/* Connector line */}
            {i < total - 1 && (
              <div className={[
                'flex-1 h-0.5 mx-1',
                done ? 'bg-primary' : 'bg-surface-container',
              ].join(' ')} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;

