import { NearbyPlace } from '../../types/property';
import NearbyPlaceRow from '../ui/NearbyPlaceRow';

interface LocationSectionProps {
  mapImage: string;
  nearbyPlaces: NearbyPlace[];
}

const LocationSection = ({ mapImage, nearbyPlaces }: LocationSectionProps) => (
  <div className="mb-8">
    <h3 className="font-h3 text-h3 mb-4">Location</h3>
    <div className="w-full h-48 lg:h-64 rounded-xl overflow-hidden bg-surface-container shadow-inner mb-3">
      <img alt="Map" className="w-full h-full object-cover grayscale opacity-80" src={mapImage} />
    </div>
    <div className="space-y-3">
      {nearbyPlaces.map((place) => (
        <NearbyPlaceRow
          key={place.name}
          icon={place.icon}
          name={place.name}
          distance={place.distance}
        />
      ))}
    </div>
  </div>
);

export default LocationSection;
