interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

const StatCard = ({ icon, value, label }: StatCardProps) => (
  <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center text-center">
    <span className="material-symbols-outlined text-primary mb-2">{icon}</span>
    <span className="font-label-bold text-label-bold">{value}</span>
    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">{label}</span>
  </div>
);

export default StatCard;
