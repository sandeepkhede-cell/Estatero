import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { agentService } from '../../services/agentService';
import { Agent, Property } from '../../types/property';
import PropertyCard from '../../components/ui/PropertyCard';
import { useFavourites } from '../../hooks/useFavourites';
import { formatINR } from '../../utils/formatINR';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';

const AgentProfilePage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { toggle }   = useFavourites();
  const { user }     = useAuth();
  const { open }     = useAuthModal();

  const [agent,      setAgent]      = useState<Agent | null>(null);
  const [listings,   setListings]   = useState<Property[]>([]);
  const [loadingA,   setLoadingA]   = useState(true);
  const [loadingL,   setLoadingL]   = useState(true);
  const [showPhone,  setShowPhone]  = useState(false);

  // Rating
  const [myRating,     setMyRating]     = useState<number | null>(null);
  const [hoverStar,    setHoverStar]    = useState<number | null>(null);
  const [ratingBusy,   setRatingBusy]   = useState(false);
  const [avgRating,    setAvgRating]    = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    const numId = Number(id);

    agentService.getById(numId)
      .then((a) => { setAgent(a); setAvgRating(a.rating ?? 0); })
      .finally(() => setLoadingA(false));

    agentService.getProperties(numId)
      .then(setListings)
      .finally(() => setLoadingL(false));
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;
    agentService.getMyRating(Number(id))
      .then(({ rating }) => setMyRating(rating))
      .catch(() => {});
  }, [id, user]);

  const handleRate = async (star: number) => {
    if (!user) { open('login'); return; }
    if (ratingBusy) return;
    setRatingBusy(true);
    try {
      const { newAverage } = await agentService.rate(Number(id), star);
      setMyRating(star);
      setAvgRating(newAverage);
    } finally {
      setRatingBusy(false);
    }
  };

  if (loadingA) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center py-24 gap-4">
        <span className="material-symbols-outlined text-outline text-7xl">person_off</span>
        <p className="text-on-surface-variant">Agent not found.</p>
      </div>
    );
  }

  const initials = agent.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <main className="flex-grow bg-surface-bright">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Agent card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-primary to-primary-container" />

          <div className="px-6 md:px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end gap-5 -mt-12 mb-5 flex-wrap">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-primary text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
                {agent.avatar
                  ? <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                  : initials}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <h1 className="text-xl font-bold text-on-surface">{agent.name}</h1>
                <p className="text-sm text-on-surface-variant capitalize">{agent.role}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 bg-surface-container-low rounded-xl p-4 mb-6 text-center">
              <div>
                <p className="text-lg font-bold text-on-surface">{listings.length}</p>
                <p className="text-xs text-on-surface-variant">Listings</p>
              </div>
              <div>
                <p className="text-lg font-bold text-on-surface">
                  {listings.length > 0 ? formatINR(Math.min(...listings.map((l) => l.price))) : '—'}
                </p>
                <p className="text-xs text-on-surface-variant">Starting from</p>
              </div>
              <div>
                <p className="text-lg font-bold text-on-surface capitalize">{agent.role}</p>
                <p className="text-xs text-on-surface-variant">Type</p>
              </div>
            </div>

            {/* Star rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverStar ?? myRating ?? 0) >= star;
                  return (
                    <button
                      key={star}
                      disabled={ratingBusy}
                      onClick={() => handleRate(star)}
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(null)}
                      className="text-amber-400 transition-transform hover:scale-110 disabled:opacity-50"
                    >
                      <span
                        className="material-symbols-outlined text-[26px]"
                        style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="text-sm text-on-surface-variant">
                <span className="font-bold text-on-surface">{avgRating.toFixed(1)}</span>
                {myRating
                  ? <span className="ml-1.5 text-xs">(your rating: {myRating}★)</span>
                  : <span className="ml-1.5 text-xs">— Rate this agent</span>
                }
              </div>
            </div>

            {/* Contact buttons */}
            <div className="flex gap-3 flex-wrap">
              {agent.phone && (
                showPhone ? (
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    {agent.phone}
                  </a>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    View Phone Number
                  </button>
                )
              )}
              <button
                onClick={() => document.getElementById('agent-listings')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 border-2 border-primary text-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-fixed transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                View All Listings
              </button>
            </div>
          </div>
        </div>

        {/* Listings grid */}
        <h2 id="agent-listings" className="text-lg font-bold text-on-surface mb-4">
          Properties by {agent.name}
        </h2>

        {loadingL ? (
          <div className="flex justify-center py-16">
            <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <span className="material-symbols-outlined text-outline text-6xl">home</span>
            <p className="text-on-surface-variant">No active listings at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onCardClick={(pid) => navigate(`/property/${pid}`)}
                onFavourite={toggle}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default AgentProfilePage;
