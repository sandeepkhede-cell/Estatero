import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { userService, UserProfile } from '../../services/userService';
import { Property } from '../../types/property';
import PropertyCard from '../../components/ui/PropertyCard';
import { useFavourites } from '../../hooks/useFavourites';
import { useSavedProperties } from '../../hooks/useSavedProperties';

type Tab = 'listings' | 'saved';

const inputCls = 'w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

const ProfilePage = () => {
  const navigate           = useNavigate();
  const { user, logout }   = useAuth();
  const { open }           = useAuthModal();
  const { toggle }         = useFavourites();
  const { properties: savedProperties, loading: loadingS, toggle: savedToggle } = useSavedProperties();

  const [tab,        setTab]        = useState<Tab>('listings');
  const [profile,    setProfile]    = useState<UserProfile | null>(null);
  const [listings,   setListings]   = useState<Property[]>([]);
  const [loadingP,   setLoadingP]   = useState(true);
  const [loadingL,   setLoadingL]   = useState(true);

  // Edit mode
  const [editing,   setEditing]   = useState(false);
  const [editName,  setEditName]  = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving,    setSaving]    = useState(false);
  const [saveErr,   setSaveErr]   = useState('');

  useEffect(() => {
    if (!user) { open('login'); return; }
    userService.getById(user.id)
      .then((p) => { setProfile(p); setEditName(p.name); setEditPhone(p.phone ?? ''); })
      .finally(() => setLoadingP(false));
    userService.getProperties(user.id)
      .then(setListings)
      .finally(() => setLoadingL(false));
  }, [user]);

  if (!user) return null;

  const initials = user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaveErr('');
    try {
      const updated = await userService.update(user.id, { name: editName, phone: editPhone || undefined });
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      setSaveErr((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-grow bg-surface-bright">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-start gap-5 flex-wrap">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>

            {/* Info / Edit form */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <form onSubmit={handleSave} className="space-y-3 max-w-sm">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Name</label>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className={inputCls} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Phone</label>
                    <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputCls} />
                  </div>
                  {saveErr && <p className="text-sm text-error">{saveErr}</p>}
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditing(false)} className="text-on-surface-variant text-sm font-semibold px-3">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-on-surface">{loadingP ? '…' : profile?.name ?? user.name}</h1>
                  <p className="text-sm text-on-surface-variant mt-0.5">{user.email}</p>
                  {profile?.phone && (
                    <p className="text-sm text-on-surface-variant mt-0.5">{profile.phone}</p>
                  )}
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Edit Profile
                    </button>
                    <span className="text-outline-variant">·</span>
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="text-sm font-semibold text-red-500 hover:underline flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Post property CTA */}
            <button
              onClick={() => navigate('/post-property')}
              className="flex-shrink-0 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-container transition-colors"
            >
              + Post Property
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant mb-6">
          {(['listings', 'saved'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'px-6 py-3 text-sm font-semibold capitalize transition-colors',
                tab === t
                  ? 'text-primary border-b-2 border-primary -mb-px'
                  : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              {t === 'listings' ? `My Listings (${listings.length})` : `Saved (${savedProperties.length})`}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'listings' ? (
          loadingL ? (
            <div className="flex justify-center py-20">
              <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4 text-center">
              <span className="material-symbols-outlined text-outline text-7xl">home</span>
              <h3 className="text-lg font-bold text-on-surface">No listings yet</h3>
              <p className="text-body-md text-on-surface-variant">Properties you post will appear here.</p>
              <button onClick={() => navigate('/post-property')} className="mt-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold">
                Post Your First Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((p) => (
                <PropertyCard key={p.id} property={p} onCardClick={(id) => navigate(`/property/${id}`)} onFavourite={toggle} />
              ))}
            </div>
          )
        ) : loadingS ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
          </div>
        ) : savedProperties.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4 text-center">
            <span className="material-symbols-outlined text-outline text-7xl">favorite_border</span>
            <h3 className="text-lg font-bold text-on-surface">Nothing saved yet</h3>
            <p className="text-body-md text-on-surface-variant">Tap the heart on any property to save it here.</p>
            <button onClick={() => navigate('/listings')} className="mt-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold">
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((p) => (
              <PropertyCard key={p.id} property={p} onCardClick={(id) => navigate(`/property/${id}`)} onFavourite={savedToggle} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default ProfilePage;
