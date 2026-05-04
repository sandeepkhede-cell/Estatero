interface AmenityItemProps {
  icon: string;
  label: string;
}

const AmenityItem = ({ icon, label }: AmenityItemProps) => (
  <div className="flex items-center gap-3 p-3 border border-outline-variant rounded-lg">
    <span className="material-symbols-outlined text-primary">{icon}</span>
    <span className="font-body-sm text-body-sm">{label}</span>
  </div>
);

export default AmenityItem;
