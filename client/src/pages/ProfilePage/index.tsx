import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { userService, UserProfile } from '../../services/userService';
import { inquiryService, Inquiry } from '../../services/inquiryService';
import { propertyService } from '../../services/propertyService';
import { Property } from '../../types/property';
import PropertyCard from '../../components/ui/PropertyCard';
import { useFavourites } from '../../hooks/useFavourites';
import { useSavedProperties } from '../../hooks/useSavedProperties';

type Tab = 'listings' | 'saved' | 'enquiries';

interface EditForm {
  price:         string;
  description:   string;
  status:        string;
  listingStatus: string;
  availability:  string;
  furnishing:    string;
}

const LISTING_TO_STATUS: Record<string, string> = {
  'For Sale': 'for_sale',
  'For Rent': 'for_rent',
  'PG':       'pg',
  'sale':     'for_sale',
  'rent':     'for_rent',
  'pg':       'pg',
};

const LISTING_STATUS_META: Record<string, { label: string; icon: string; chip: string }> = {
  sold:   { label: 'Sold',   icon: 'sell',         chip: 'bg-red-100 text-red-700' },
  rented: { label: 'Rented', icon: 'key',          chip: 'bg-orange-100 text-orange-700' },
  paused: { label: 'Paused', icon: 'pause_circle',  chip: 'bg-gray-100 text-gray-600' },
};

const inputCls = 'w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';
const selectCls = inputCls + ' bg-white';

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

  // Profile edit
  const [editing,   setEditing]   = useState(false);
  const [editName,  setEditName]  = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving,    setSaving]    = useState(false);
  const [saveErr,   setSaveErr]   = useState('');

  // Listing delete
  const [confirmDeleteId, setConfirmDeleteId] = useState<Property['id'] | null>(null);
  const [deletingId,      setDeletingId]      = useState<Property['id'] | null>(null);

  // Inquiry reply
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyDraft,   setReplyDraft]   = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyErr,     setReplyErr]     = useState('');

  // Listing edit modal
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editForm,        setEditForm]        = useState<EditForm>({ price: '', description: '', status: 'for_sale', availability: '', furnishing: '' });
  const [editSaving,      setEditSaving]      = useState(false);
  const [editErr,         setEditErr]         = useState('');

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

  const openReply = (id: number) => {
    setReplyingToId(id);
    setReplyDraft('');
    setReplyErr('');
  };

  const handleReply = async (inquiry: Inquiry) => {
    if (!replyDraft.trim()) { setReplyErr('Reply cannot be empty.'); return; }
    setReplySending(true); setReplyErr('');
    try {
      const { repliedAt } = await inquiryService.reply(inquiry.id, replyDraft.trim());
      setInquiries((prev) => prev.map((q) =>
        q.id === inquiry.id
          ? { ...q, reply_message: replyDraft.trim(), replied_at: repliedAt, is_read: true }
          : q,
      ));
      if (!inquiry.is_read) setUnread((n) => Math.max(0, n - 1));
      setReplyingToId(null);
    } catch (err) {
      setReplyErr((err as Error).message);
    } finally {
      setReplySending(false);
    }
  };

  const handleDelete = async (id: Property['id']) => {
    setDeletingId(id);
    try {
      await propertyService.delete(id);
      setListings((prev) => prev.filter((p) => p.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (property: Property) => {
    setEditForm({
      price:         String(property.price),
      description:   property.description ?? '',
      status:        LISTING_TO_STATUS[property.listingType ?? ''] ?? 'for_sale',
      listingStatus: property.listingStatus ?? 'active',
      availability:  property.availability ?? '',
      furnishing:    property.furnishing   ?? '',
    });
    setEditErr('');
    setEditingProperty(property);
  };

  const handleEditSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    const price = Number(editForm.price);
    if (!price || price <= 0) { setEditErr('Enter a valid price.'); return; }
    setEditSaving(true); setEditErr('');
    try {
      const updated = await propertyService.update(editingProperty.id, {
        price,
        description:    editForm.description    || undefined,
        status:         editForm.status         || undefined,
        listing_status: editForm.listingStatus  || undefined,
        availability:   editForm.availability   || undefined,
        furnishing:     editForm.furnishing      || undefined,
      });
      setListings((prev) => prev.map((p) => p.id === editingProperty.id ? updated : p));
      setEditingProperty(null);
    } catch (err) {
      setEditErr((err as Error).message);
    } finally {
      setEditSaving(false);
    }
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
                <div key={p.id} className="flex flex-col">
                  <PropertyCard property={p} onCardClick={(id) => navigate(`/property/${id}`)} onFavourite={toggle} />

                  {/* Lifecycle status badge */}
                  {p.listingStatus && p.listingStatus !== 'active' && (() => {
                    const meta = LISTING_STATUS_META[p.listingStatus!];
                    return meta ? (
                      <div className="flex items-center gap-1.5 mt-2 px-1">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${meta.chip}`}>
                          <span className="material-symbols-outlined text-[12px]">{meta.icon}</span>
                          {meta.label}
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Action bar */}
                  <div className="flex gap-2 mt-2 px-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(confirmDeleteId === p.id ? null : p.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-red-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Delete
                    </button>
                  </div>

                  {/* Inline delete confirmation */}
                  {confirmDeleteId === p.id && (
                    <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-100">
                      <p className="text-sm font-semibold text-red-700 mb-2">Delete this listing permanently?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                        >
                          {deletingId === p.id ? 'Deleting…' : 'Yes, Delete'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="flex-1 border border-outline-variant py-1.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

                  <p className="mt-3 text-sm text-on-surface leading-relaxed line-clamp-3">
                    {q.message}
                  </p>

                  {/* Reply section */}
                  <div className="mt-3 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                    {q.reply_message ? (
                      <div className="bg-primary/5 border border-primary/15 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="material-symbols-outlined text-[14px] text-primary">reply</span>
                          <span className="text-xs font-bold text-primary">Your reply</span>
                          {q.replied_at && (
                            <span className="text-xs text-on-surface-variant ml-auto">{timeAgo(q.replied_at)}</span>
                          )}
                        </div>
                        <p className="text-sm text-on-surface leading-relaxed">{q.reply_message}</p>
                      </div>
                    ) : replyingToId === q.id ? (
                      <div className="space-y-2">
                        <textarea
                          autoFocus
                          rows={3}
                          value={replyDraft}
                          onChange={(e) => setReplyDraft(e.target.value)}
                          placeholder="Type your reply…"
                          className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                        {replyErr && <p className="text-xs text-red-600">{replyErr}</p>}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(q)}
                            disabled={replySending}
                            className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[14px]">send</span>
                            {replySending ? 'Sending…' : 'Send Reply'}
                          </button>
                          <button
                            onClick={() => setReplyingToId(null)}
                            className="text-xs font-semibold text-on-surface-variant px-3 hover:text-on-surface"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          onClick={() => openReply(q.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          <span className="material-symbols-outlined text-[14px]">reply</span>
                          Reply
                        </button>
                        {q.sender_phone && (
                          <a
                            href={`tel:${q.sender_phone}`}
                            className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary"
                          >
                            <span className="material-symbols-outlined text-[14px]">call</span>
                            Call Back
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>

      {/* ── Edit listing modal ── */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditingProperty(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-on-surface">Edit Listing</h2>
              <button onClick={() => setEditingProperty(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Price (₹)</label>
                <input
                  type="number"
                  min={1}
                  value={editForm.price}
                  onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Listing Type</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                  className={selectCls}
                >
                  <option value="for_sale">For Sale</option>
                  <option value="for_rent">For Rent</option>
                  <option value="pg">PG</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Listing Status</label>
                <select
                  value={editForm.listingStatus}
                  onChange={(e) => setEditForm((f) => ({ ...f, listingStatus: e.target.value }))}
                  className={selectCls}
                >
                  <option value="active">Active — visible to buyers</option>
                  {(editForm.status === 'for_rent' || editForm.status === 'pg')
                    ? <option value="rented">Rented — hide from listings</option>
                    : <option value="sold">Sold — hide from listings</option>
                  }
                  <option value="paused">Paused — temporarily hidden</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Availability</label>
                <select
                  value={editForm.availability}
                  onChange={(e) => setEditForm((f) => ({ ...f, availability: e.target.value }))}
                  className={selectCls}
                >
                  <option value="">— Not specified —</option>
                  <option value="ready-to-move">Ready to Move</option>
                  <option value="under-construction">Under Construction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Furnishing</label>
                <select
                  value={editForm.furnishing}
                  onChange={(e) => setEditForm((f) => ({ ...f, furnishing: e.target.value }))}
                  className={selectCls}
                >
                  <option value="">— Not specified —</option>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-furnished</option>
                  <option value="fully-furnished">Fully Furnished</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputCls + ' resize-none'}
                />
              </div>

              {editErr && <p className="text-sm text-red-600">{editErr}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={editSaving}
                  className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {editSaving ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="flex-1 border border-outline-variant py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;
