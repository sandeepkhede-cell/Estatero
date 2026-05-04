interface ListingsHeaderProps {
  location?: string;
  totalCount?: number;
  sortLabel?: string;
  onSortClick?: () => void;
}

const ListingsHeader = ({
  location = 'Manhattan',
  totalCount = 0,
  sortLabel = 'Relevance',
  onSortClick,
}: ListingsHeaderProps) => (
  <div className="px-6 pt-6 pb-2 flex justify-between items-end">
    <div>
      <p className="font-body-sm text-gray-500 mb-1">Found {totalCount} properties</p>
      <h2 className="font-h2 text-h3">Properties in {location}</h2>
    </div>
    <button
      onClick={onSortClick}
      className="flex items-center gap-1 text-primary font-label-bold text-body-sm"
    >
      <span className="material-symbols-outlined text-[18px]">sort</span>
      {sortLabel}
    </button>
  </div>
);

export default ListingsHeader;
