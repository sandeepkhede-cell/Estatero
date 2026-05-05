import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { agentService } from '../../services/agentService';
import { Agent } from '../../types/property';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={`material-symbols-outlined text-[16px] ${
          s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'
        }`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
    ))}
    <span className="ml-1 text-xs text-on-surface-variant font-medium">{rating.toFixed(1)}</span>
  </div>
);

const AgentCard = ({ agent }: { agent: Agent }) => {
  const navigate = useNavigate();
  const [showPhone, setShowPhone] = useState(false);

  const initials = agent.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-primary text-white text-xl font-bold flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
          {agent.avatar
            ? <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
            : initials}
        </div>
        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate(`/agent/${agent.id}`)}
            className="text-base font-bold text-on-surface hover:text-primary transition-colors text-left leading-tight"
          >
            {agent.name}
          </button>
          <p className="text-xs text-on-surface-variant mt-0.5 truncate">{agent.role}</p>
          {(agent as Agent & { rating?: number }).rating !== undefined && (
            <div className="mt-1">
              <StarRating rating={(agent as Agent & { rating?: number }).rating!} />
            </div>
          )}
        </div>
        {(agent as Agent & { listingsCount?: number }).listingsCount !== undefined && (
          <div className="text-center flex-shrink-0">
            <p className="text-lg font-bold text-primary">
              {(agent as Agent & { listingsCount?: number }).listingsCount}
            </p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Listings</p>
          </div>
        )}
      </div>

      {/* Bio */}
      {(agent as Agent & { bio?: string }).bio && (
        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
          {(agent as Agent & { bio?: string }).bio}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => navigate(`/agent/${agent.id}`)}
          className="flex-1 bg-primary-container text-on-primary text-xs font-semibold py-2 rounded-lg hover:bg-primary transition-colors"
        >
          View Profile
        </button>

        {agent.phone && (
          showPhone ? (
            <a
              href={`tel:${agent.phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 border border-primary text-primary text-xs font-semibold py-2 rounded-lg hover:bg-primary-fixed transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">call</span>
              {agent.phone}
            </a>
          ) : (
            <button
              onClick={() => setShowPhone(true)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-primary text-primary text-xs font-semibold py-2 rounded-lg hover:bg-primary-fixed transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">call</span>
              View Number
            </button>
          )
        )}
      </div>
    </div>
  );
};

const AgentsPage = () => {
  const [agents, setAgents]     = useState<Agent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [query, setQuery]       = useState('');

  const load = useCallback((q: string) => {
    setLoading(true);
    agentService.getAll(q || undefined)
      .then((res) => setAgents(res.agents))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(''); }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
    load(search);
  };

  const handleClear = () => {
    setSearch('');
    setQuery('');
    load('');
  };

  return (
    <main className="flex-grow bg-surface-bright">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary to-primary-container py-10 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">Find a Real Estate Agent</h1>
          <p className="text-white/80 text-sm mb-6">Connect with verified agents across India</p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm">
              <span className="material-symbols-outlined text-outline text-xl">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by agent name or agency..."
                className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-outline"
              />
              {search && (
                <button type="button" onClick={handleClear}>
                  <span className="material-symbols-outlined text-outline text-lg">close</span>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-white text-primary font-semibold text-sm px-5 rounded-xl hover:bg-primary-fixed transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-on-surface-variant">
            {loading ? 'Loading...' : (
              query
                ? `${agents.length} agent${agents.length !== 1 ? 's' : ''} matching "${query}"`
                : `${agents.length} agents available`
            )}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
          </div>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-4 text-center">
            <span className="material-symbols-outlined text-outline text-7xl">person_search</span>
            <p className="text-on-surface font-semibold">No agents found</p>
            <p className="text-on-surface-variant text-sm">Try a different name or clear the search</p>
            <button
              onClick={handleClear}
              className="mt-2 text-primary font-semibold text-sm hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AgentsPage;
