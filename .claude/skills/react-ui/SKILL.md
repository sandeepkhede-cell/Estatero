# Skill: react-ui

## Purpose
Create production-ready React components with TypeScript and Tailwind CSS for a 99acres-style real estate platform — from atomic UI elements to complex feature components.

## When to Use
- Building a new UI component from scratch (button, card, modal, form, etc.)
- Creating a domain-specific component (PropertyCard, SearchBar, FilterPanel, etc.)
- Implementing a layout component (Navbar, Sidebar, Grid, PageShell)
- Adding a form with validation
- Building interactive elements (dropdown, accordion, tabs, tooltip)

## Component Creation Rules
1. **Functional components only** — no class components
2. **TypeScript-first** — define props interface before writing the component
3. **Named exports** for reusable components; default export only for pages
4. **Single responsibility** — one component does one thing
5. **No inline styles** — Tailwind classes only; extract repeated patterns to a variable
6. **No `any` types** — use proper TypeScript generics or unions
7. **Accessible by default** — correct ARIA roles, keyboard navigation, focus management

## File Placement
| Component type | Folder |
|---|---|
| Generic (Button, Input, Badge, Modal) | `src/components/common/` |
| Property domain (PropertyCard, PriceTag) | `src/components/property/` |
| Layout (Navbar, Footer, Sidebar) | `src/components/common/` |
| Full-page route component | `src/pages/` |
| Reusable hook extracted from component | `src/hooks/` |
| TypeScript types for the component | `src/types/` |

## Component Template
```tsx
// src/components/common/ComponentName.tsx
import { useState } from 'react';

interface ComponentNameProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function ComponentName({
  label,
  variant = 'primary',
  disabled = false,
  onClick,
  children,
}: ComponentNameProps) {
  const variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-white text-red-600 border border-red-600 hover:bg-red-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-md text-sm font-medium
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
      `}
    >
      {children ?? label}
    </button>
  );
}
```

## Common Patterns

### Conditional rendering
```tsx
// prefer ternary over && for values that may be 0
{count > 0 ? <Badge count={count} /> : null}
```

### List rendering
```tsx
{properties.map((property) => (
  <PropertyCard key={property.id} property={property} />
))}
```

### Loading / Error / Empty states — always handle all three
```tsx
if (isLoading) return <Loader />;
if (error) return <ErrorMessage message={error.message} />;
if (items.length === 0) return <EmptyState message="No properties found" />;
```

### Controlled input
```tsx
const [value, setValue] = useState('');

<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
/>
```

### Forward ref for inputs
```tsx
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input ref={ref} {...props} className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
);
Input.displayName = 'Input';
```

### Modal with portal
```tsx
import { createPortal } from 'react-dom';

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4">
        {children}
      </div>
    </div>,
    document.body
  );
}
```

### useClickOutside hook
```tsx
// src/hooks/useClickOutside.ts
import { useEffect, RefObject } from 'react';

export function useClickOutside(ref: RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}
```

## Tailwind Design Tokens (project-wide)
| Token | Classes |
|---|---|
| Primary action | `bg-red-600 hover:bg-red-700 text-white` |
| Secondary action | `border border-red-600 text-red-600 hover:bg-red-50` |
| Surface / card | `bg-white rounded-xl shadow-sm border border-gray-100` |
| Text primary | `text-gray-900` |
| Text secondary | `text-gray-500` |
| Input base | `border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none` |
| Badge / tag | `bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full` |

## Real Estate Domain Components

### PropertyCard skeleton
```tsx
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  area: number;
  type: 'sale' | 'rent';
  images: string[];
}

interface PropertyCardProps {
  property: Property;
  onSave?: (id: string) => void;
}

export function PropertyCard({ property, onSave }: PropertyCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={property.images[0]}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
        <p className="text-red-600 font-bold text-lg">₹{property.price.toLocaleString('en-IN')}</p>
        <p className="text-gray-500 text-sm">{property.location}</p>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>{property.bedrooms} BHK</span>
          <span>·</span>
          <span>{property.area} sq.ft</span>
          <span>·</span>
          <span className="capitalize">{property.type}</span>
        </div>
        {onSave && (
          <button
            type="button"
            onClick={() => onSave(property.id)}
            className="mt-2 text-sm text-red-600 hover:underline self-start"
          >
            Save
          </button>
        )}
      </div>
    </article>
  );
}
```

## Accessibility Checklist
- [ ] All interactive elements reachable via `Tab`
- [ ] Buttons use `type="button"` unless submitting a form
- [ ] Images have descriptive `alt` text
- [ ] Modals trap focus and close on `Escape`
- [ ] Form fields have associated `<label>` via `htmlFor`
- [ ] Error messages are linked to inputs via `aria-describedby`
- [ ] Color is never the only indicator of state (add icon or text)

## Output Format
- Provide the full file path as a header (`src/components/common/Button.tsx`)
- Show the complete component file (imports + interface + component)
- If a custom hook is extracted, show it as a separate file
- End with: "Usage example:" and a one-line JSX snippet showing how to use it
