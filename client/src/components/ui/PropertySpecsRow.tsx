import { PropertySpec } from '../../types/property';

interface PropertySpecsRowProps {
  specs: PropertySpec[];
}

const PropertySpecsRow = ({ specs }: PropertySpecsRowProps) => (
  <div className="flex items-center gap-4 py-sm border-y border-outline-variant/30">
    {specs.map((spec) => (
      <div key={spec.label} className="flex flex-col">
        <span className="text-[10px] text-outline uppercase font-bold">{spec.label}</span>
        <span className="text-body-sm font-semibold">{spec.value}</span>
      </div>
    ))}
  </div>
);

export default PropertySpecsRow;
