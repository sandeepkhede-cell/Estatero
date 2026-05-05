import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-body-sm text-on-surface-variant min-w-0">
    {items.map((item, i) => {
      const isLast = i === items.length - 1;
      return (
        <span key={i} className="flex items-center gap-1 min-w-0">
          {i > 0 && (
            <span className="material-symbols-outlined text-[14px] text-outline flex-shrink-0">
              chevron_right
            </span>
          )}
          {isLast || !item.href ? (
            <span className={`truncate ${isLast ? 'text-on-surface font-semibold' : ''}`}>
              {item.label}
            </span>
          ) : (
            <Link
              to={item.href}
              className="hover:text-primary hover:underline transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          )}
        </span>
      );
    })}
  </nav>
);

export default Breadcrumb;
