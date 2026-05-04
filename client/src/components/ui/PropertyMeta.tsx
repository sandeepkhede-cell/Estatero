import { PropertyMetaItem } from '../../types/property';

interface PropertyMetaProps {
  items: PropertyMetaItem[];
  size?: 'sm' | 'md';
}

const iconSizes = {
  sm: 'text-sm',
  md: 'text-[20px]',
};

const PropertyMeta = ({ items, size = 'md' }: PropertyMetaProps) => (
  <div className="flex items-center gap-4 text-outline text-body-sm">
    {items.map((item, idx) => (
      <span key={idx} className="flex items-center gap-1 text-on-surface">
        <span className={`material-symbols-outlined text-gray-400 ${iconSizes[size]}`}>
          {item.icon}
        </span>
        <span className="font-label-bold text-body-sm">{item.value}</span>
      </span>
    ))}
  </div>
);

export default PropertyMeta;
