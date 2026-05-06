import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { userService, UserProfile } from '../../services/userService';
import { inquiryService, Inquiry } from '../../services/inquiryService';
import { Property } from '../../types/property';
import PropertyCard from '../../components/ui/PropertyCard';
import { useFavourites } from '../../hooks/useFavourites';
import { useSavedProperties } from '../../hooks/useSavedProperties';

type Tab = 'listings' | 'saved' | 'enquiries';

const inputCls = 'w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ProfilePage = () => {
  const navigate           = useNavigate();
  const { user, logout }   = useAuth();
  const { open }           = useAuthModal();
  const { toggle }         = useFavourites();
  const { properties: savedProperties, loading: loadingS, toggle: savedToggle } = useSavedProperties();

  const [tab,        setTab]        = useState<Tab>('listings');
  const [profile,    setProfile]    = useState<UserProfile | null>(null);
  const [listings,   setListings]   = useState<Property[]>([]);
  const [inquiries,  setInquiries]  = useState<Inquiry[]>([]);
  const [unread,     setUnread]     = useState(0);
  const [loadingP,   setLoadingP]   = useState(true);
  const [loadingL,   setLoadingL]   = useState(true);
  const [loadingI,   setLoadingI]   = useState(true);

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
    inquiryService.getAll()
      .then(({ inquiries: list, unreadCount }) => { setInquiries(list); setUnread(unreadCount); })
      .catch(() => {})
      .finally(() => setLoadingI(false));
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

  const handleMarkRead = async (inquiry: Inquiry) => {
    if (inquiry.is_read) return;
    try {
      await inquiryService.markRead(inquiry.id);
      setInquiries((prev) => prev.map((q) => q.id === inquiry.id ? { ...q, is_read: true } : q));
      setUnread((n) => Math.max(0, n - 1));
    } catch { /* silent */ }
  };

  return (
    <main className="flex-grow bg-surface-bright">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-20 h-20 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>

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
          {(['listings', 'saved', 'enquiries'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'relative px-6 py-3 text-sm font-semibold capitalize transition-colors',
                tab === t
                  ? 'text-primary border-b-2 border-primary -mb-px'
                  : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              {t === 'listings'   && `My Listings (${listings.length})`}
              {t === 'saved'      && `Saved (${savedProperties.length})`}
              {t === 'enquiries'  && (
                <>
                  Enquiries
                  {unread > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </>
              )}
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
        ) : tab === 'saved' ? (
          loadingS ? (
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
          )
        ) : (
          /* ── Enquiries tab ── */
          loadingI ? (
            <div className="flex justify-center py-20">
              <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4 text-center">
              <span className="material-symbols-outlined text-outline text-7xl">mark_email_unread</span>
              <h3 className="text-lg font-bold text-on-surface">No enquiries yet</h3>
              <p className="text-body-md text-on-surface-variant">When someone sends an enquiry on your listings, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((q) => (
                <div
                  key={q.id}
                  onClick={() => handleMarkRead(q)}
                  className={[
                    'bg-white rounded-xl border p-5 cursor-pointer transition-colors',
                    q.is_read
                      ? 'border-gray-100'
                      : 'border-primary/30 bg-primary/[0.02]',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {q.sender_name
                          ? q.sender_name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
                          : <span className="material-symbols-outlined text-[18px]">person</span>
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">
                          {q.sender_name ?? 'Anonymous'}
                          {!q.is_read && (
                            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary align-middle" />
                          )}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {q.sender_email && (
                            <a
                              href={`mailto:${q.sender_email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-primary hover:underline"
                            >
                              {q.sender_email}
                            </a>
                          )}
                          {q.sender_phone && (
                            <a
                              href={`tel:${q.sender_phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-primary hover:underline flex items-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[12px]">call</span>
                              {q.sender_phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-on-surface-variant whitespace-nowrap flex-shrink-0">
                      {timeAgo(q.created_at)}
                    </span>
                  </div>

                  {/* Property reference */}
                  {q.property_title && (
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/property/${q.property_id}`); }}
                      className="mt-3 flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">home</span>
                      <span className="truncate">{q.property_title}</span>
                      {q.property_city && <span>· {q.property_city}</span>}
                    </button>
                  )}

                  {/* Message */}
                  <p className="mt-3 text-sm text-on-surface leading-relaxed line-clamp-3">
                    {q.message}
                  </p>

                  {/* Reply action */}
                  {q.sender_email && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                      <a
                        href={`mailto:${q.sender_email}?subject=Re: ${encodeURIComponent(q.property_title ?? 'Your Enquiry')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <span className="material-symbols-outlined text-[14px]">reply</span>
                        Reply via Email
                      </a>
                      {q.sender_phone && (
                        <a
                          href={`tel:${q.sender_phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-[14px]">call</span>
                          Call Back
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </main>
  );
};

export default ProfilePage;
