import { Agent } from '../../types/property';

interface AgentCardProps {
  agent: Agent;
  onCall?: () => void;
}

const AgentCard = ({ agent, onCall }: AgentCardProps) => (
  <div className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4 mb-4">
    <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-variant flex-shrink-0">
      <img alt={agent.name} className="w-full h-full object-cover" src={agent.avatar} />
    </div>
    <div className="flex-1">
      <h4 className="font-h3 text-[18px]">{agent.name}</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{agent.role}</p>
    </div>
    <button
      onClick={onCall}
      className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary active:bg-primary-fixed"
    >
      <span className="material-symbols-outlined">call</span>
    </button>
  </div>
);

export default AgentCard;
