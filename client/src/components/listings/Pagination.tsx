interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const visiblePages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);
  const showEllipsis = totalPages > 3;

  return (
    <nav className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-all disabled:opacity-40"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
            page === currentPage
              ? 'bg-primary text-on-primary'
              : 'border border-outline-variant hover:bg-surface-container'
          }`}
        >
          {page}
        </button>
      ))}

      {showEllipsis && <span className="px-2">...</span>}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-all disabled:opacity-40"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </nav>
  );
};

export default Pagination;
