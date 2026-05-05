import { Property } from '../../types/property';

interface KeyDetailsSectionProps {
  property: Property;
}

function humanize(val: string): string {
  return val
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const KeyDetailsSection = ({ property }: KeyDetailsSectionProps) => {
  const rows: { label: string; value: string }[] = [
    property.propertyType  && { label: 'Property Type',    value: humanize(property.propertyType) },
    property.furnishing    && { label: 'Furnishing',        value: humanize(property.furnishing) },
    property.floor         && { label: 'Floor',             value: property.floor },
    property.facing        && { label: 'Facing',            value: property.facing },
    property.availability  && { label: 'Availability',      value: humanize(property.availability) },
    property.ageOfProperty && { label: 'Age of Property',   value: property.ageOfProperty },
    property.bathrooms     && { label: 'Bathrooms',         value: String(property.bathrooms) },
    property.isReraRegistered !== undefined && {
      label: 'RERA',
      value: property.isReraRegistered
        ? `Registered${property.reraNumber ? ` • ${property.reraNumber}` : ''}`
        : 'Not Registered',
    },
  ].filter(Boolean) as { label: string; value: string }[];

  if (rows.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="font-h3 text-h3 text-on-surface mb-4">Key Details</h2>
      <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
        <dl className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-outline-variant">
          {rows.map(({ label, value }) => (
            <div key={label} className="px-5 py-4">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                {label}
              </dt>
              <dd className="text-body-md font-semibold text-on-surface">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default KeyDetailsSection;
