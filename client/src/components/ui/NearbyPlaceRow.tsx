interface NearbyPlaceRowProps {
  icon: string;
  name: string;
  distance: string;
}

const NearbyPlaceRow = ({ icon, name, distance }: NearbyPlaceRowProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
      <span className="font-body-sm text-body-sm">{name}</span>
    </div>
    <span className="font-label-bold text-label-bold text-on-surface-variant">{distance}</span>
  </div>
);

export default NearbyPlaceRow;
