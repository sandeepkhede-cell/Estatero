import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { formatINR } from '../../utils/formatINR';

const CompareBar = () => {
  const navigate = useNavigate();
  const { selected, toggle, clear } = useCompare();

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">

        <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
          {selected.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 bg-surface-bright border border-gray-100 rounded-xl px-3 py-2 min-w-0"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-on-surface truncate max-w-[120px]">{p.title}</p>
                <p className="text-xs text-primary font-semibold">{formatINR(p.price)}</p>
              </div>
              <button
                onClick={() => toggle(p)}
                className="ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">close</span>
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 3 - selected.length }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-[170px] h-[56px] border-2 border-dashed border-gray-200 rounded-xl"
            >
              <span className="text-xs text-on-surface-variant">+ Add property</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clear}
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2"
          >
            Clear
          </button>
          <button
            disabled={selected.length < 2}
            onClick={() => navigate(`/compare?ids=${selected.map((p) => p.id).join(',')}`)}
            className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Compare {selected.length < 2 ? `(need ${2 - selected.length} more)` : 'Now'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CompareBar;
