import StatCard from '../ui/StatCard';

interface Stat {
  icon: string;
  value: string;
  label: string;
}

interface PropertyStatGridProps {
  stats: Stat[];
}

const PropertyStatGrid = ({ stats }: PropertyStatGridProps) => (
  <div className="grid grid-cols-3 gap-3 mb-8">
    {stats.map((stat) => (
      <StatCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
    ))}
  </div>
);

export default PropertyStatGrid;
