import { Amenity } from '../../types/property';
import AmenityItem from '../ui/AmenityItem';

interface AmenitiesSectionProps {
  amenities: Amenity[];
  onViewAll?: () => void;
}

const AmenitiesSection = ({ amenities, onViewAll }: AmenitiesSectionProps) => (
  <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-h3 text-h3">Amenities</h3>
      <button onClick={onViewAll} className="text-primary font-label-bold text-label-bold">
        View All
      </button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {amenities.map((item) => (
        <AmenityItem key={item.label} icon={item.icon} label={item.label} />
      ))}
    </div>
  </div>
);

export default AmenitiesSection;
