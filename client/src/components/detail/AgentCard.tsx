import { useNavigate } from 'react-router-dom';
import { Agent } from '../../types/property';

interface AgentCardProps {
  agent: Agent;
  onCall?: () => void;
}

const AgentCard = ({ agent, onCall }: AgentCardProps) => {
  const navigate = useNavigate();
  return (
    <div className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4 mb-4">
      <button
        onClick={() => navigate(`/agent/${agent.id}`)}
        className="w-14 h-14 rounded-full overflow-hidden bg-surface-variant flex-shrink-0 hover:ring-2 hover:ring-primary transition-all"
      >
        <img alt={agent.name} className="w-full h-full object-cover" src={agent.avatar} />
      </button>
      <div className="flex-1 min-w-0">
        <button
          onClick={() => navigate(`/agent/${agent.id}`)}
          className="font-h3 text-[18px] hover:text-primary transition-colors text-left"
        >
          {agent.name}
        </button>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{agent.tagline ?? agent.role}</p>
      </div>
      <button
        onClick={onCall}
        className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary active:bg-primary-fixed flex-shrink-0"
      >
        <span className="material-symbols-outlined">call</span>
      </button>
    </div>
  );
};

export default AgentCard;
