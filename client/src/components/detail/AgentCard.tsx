import { useNavigate } from 'react-router-dom';
import { Agent } from '../../types/property';

interface AgentCardProps {
  agent:    Agent;
  onCall?:  () => void;
}

const ROLE_LABELS: Record<string, string> = {
  agent:   'Real Estate Agent',
  owner:   'Property Owner',
  builder: 'Developer / Builder',
};

const AgentCard = ({ agent, onCall }: AgentCardProps) => {
  const navigate = useNavigate();

  const initials = agent.name
    .split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const subtitle = agent.tagline ?? ROLE_LABELS[agent.role] ?? 'Agent';

  return (
    <div className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4 mb-4">
      <button
        onClick={() => navigate(`/agent/${agent.id}`)}
        className="w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 hover:ring-2 hover:ring-primary transition-all flex items-center justify-center"
      >
        {agent.avatar ? (
          <img
            alt={agent.name}
            className="w-full h-full object-cover"
            src={agent.avatar}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex'); }}
          />
        ) : null}
        <span
          className="text-primary font-bold text-lg"
          style={{ display: agent.avatar ? 'none' : 'flex' }}
        >
          {initials}
        </span>
      </button>

      <div className="flex-1 min-w-0">
        <button
          onClick={() => navigate(`/agent/${agent.id}`)}
          className="font-h3 text-[18px] hover:text-primary transition-colors text-left truncate block"
        >
          {agent.name}
        </button>
        <p className="text-body-sm text-on-surface-variant truncate">{subtitle}</p>
      </div>

      {agent.phone ? (
        <button
          onClick={onCall}
          className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">call</span>
        </button>
      ) : (
        <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant flex-shrink-0" title="No phone number">
          <span className="material-symbols-outlined text-[20px]">phone_disabled</span>
        </div>
      )}
    </div>
  );
};

export default AgentCard;
