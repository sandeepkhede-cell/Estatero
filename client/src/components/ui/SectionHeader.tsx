import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
}

const SectionHeader = ({ title, action }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-lg">
    <h2 className="font-h2 text-h2 text-on-surface">{title}</h2>
    {action && <div>{action}</div>}
  </div>
);

export default SectionHeader;
