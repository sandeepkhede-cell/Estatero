import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { userService, UserProfile } from '../../services/userService';
import { inquiryService, Inquiry, SentInquiry, InquiryMessage } from '../../services/inquiryService';
import { propertyService } from '../../services/propertyService';
import { agentService, MyAgentProfile } from '../../services/agentService';
import { savedSearchService, SavedSearch } from '../../services/savedSearchService';
import { projectService, Project } from '../../services/projectService';
import { Property } from '../../types/property';
import PropertyCard from '../../components/ui/PropertyCard';
import { useFavourites } from '../../hooks/useFavourites';
import { useSavedProperties } from '../../hooks/useSavedProperties';

const API_BASE = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_URL
  ?? 'http://localhost:5000/api';

async function uploadSingleFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('images', file);
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json() as { urls: string[] };
  return data.urls[0];
}

type Tab = 'listings' | 'saved' | 'enquiries' | 'stats' | 'searches' | 'history' | 'projects';

const CAN_POST_ROLES = ['agent', 'owner', 'builder'] as const;
type PostingRole = typeof CAN_POST_ROLES[number];
const canPost = (role?: string): role is PostingRole =>
  CAN_POST_ROLES.includes(role as PostingRole);

const ROLE_PROFILE_LABELS: Record<PostingRole, { section: string; companyLabel: string; licenseLabel: string; bioPlaceholder: string; showCompany: boolean; showLicense: boolean }> = {
  agent:   { section: 'Agent Profile',   companyLabel: 'Agency Name',          licenseLabel: 'RERA / License Number', bioPlaceholder: 'Tell buyers about yourself…',            showCompany: true,  showLicense: true  },
  owner:   { section: 'Owner Profile',   companyLabel: '',                     licenseLabel: '',                      bioPlaceholder: 'Tell buyers about yourself and the property…', showCompany: false, showLicense: false },
  builder: { section: 'Builder Profile', companyLabel: 'Company / Developer Name', licenseLabel: 'RERA Number',       bioPlaceholder: 'Describe your company and projects…',    showCompany: true,  showLicense: true  },
};

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
  const { user, logout, loading: authLoading } = useAuth();
  const { open }           = useAuthModal();
  const { toggle }         = useFavourites();
  const { properties: savedProperties, loading: loadingS, toggle: savedToggle } = useSavedProperties();

  const [tab,        setTab]        = useState<Tab>(() => canPost(user?.role) ? 'listings' : 'saved');
  const [agentStats, setAgentStats] = useState<{ totalViews: number; totalListings: number; totalEnquiries: number; responseRate: number | null; avgResponseHours: number | null } | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [savedSearchLoading, setSavedSearchLoading] = useState(false);
  const [projects,   setProjects]   = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectCity, setNewProjectCity] = useState('');
  const [addingProject, setAddingProject] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDesc, setEditProjectDesc] = useState('');
  const [editProjectCity, setEditProjectCity] = useState('');
  const [editProjectStatus, setEditProjectStatus] = useState('');
  const [savingProject, setSavingProject] = useState(false);
  const [viewedHistory, setViewedHistory] = useState<{ id: number; title: string; location: string; price: number; viewedAt: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('estatero_viewed') ?? '[]'); } catch { return []; }
  });
  const [profile,    setProfile]    = useState<UserProfile | null>(null);
  const [listings,   setListings]   = useState<Property[]>([]);
  const [inquiries,     setInquiries]     = useState<Inquiry[]>([]);
  const [sentInquiries, setSentInquiries] = useState<SentInquiry[]>([]);
  const [unread,        setUnread]        = useState(0);
  const [seenReplies,   setSeenReplies]   = useState<Record<number, string>>(() => {
    try {
      const s = localStorage.getItem('estatero_seen_replies');
      return s ? (JSON.parse(s) as Record<number, string>) : {};
    } catch { return {}; }
  });
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

  // Builder: link property to project
  const [linkingProjectId, setLinkingProjectId] = useState<Property['id'] | null>(null);
  const [linkingSaving,    setLinkingSaving]    = useState(false);

  // Inquiry thread
  const [threadMap,     setThreadMap]     = useState<Record<number, InquiryMessage[]>>({});
  const [expandedId,    setExpandedId]    = useState<number | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [msgDraft,      setMsgDraft]      = useState('');
  const [msgSending,    setMsgSending]    = useState(false);
  const [msgErr,        setMsgErr]        = useState('');

  // Listing edit modal
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editForm,        setEditForm]        = useState<EditForm>({ price: '', description: '', status: 'for_sale', listingStatus: 'active', availability: '', furnishing: '' });
  const [editSaving,      setEditSaving]      = useState(false);
  const [editErr,         setEditErr]         = useState('');

  // Agent profile
  const [agentProfile,         setAgentProfile]         = useState<MyAgentProfile | null>(null);
  const [editingAgent,         setEditingAgent]         = useState(false);
  const [agentForm,            setAgentForm]            = useState({ agencyName: '', bio: '', licenseNumber: '' });
  const [agentSaving,          setAgentSaving]          = useState(false);
  const [agentErr,             setAgentErr]             = useState('');
  const [agentAvatarUploading, setAgentAvatarUploading] = useState(false);
  const agentAvatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { open('login'); return; }
    userService.getById(user.id)
      .then((p) => { setProfile(p); setEditName(p.name); setEditPhone(p.phone ?? ''); })
      .finally(() => setLoadingP(false));
    userService.getProperties(user.id)
      .then(setListings)
      .finally(() => setLoadingL(false));
    if (canPost(user.role)) {
      inquiryService.getAll()
        .then(({ inquiries: list, unreadCount }) => { setInquiries(list); setUnread(unreadCount); })
        .catch(() => {})
        .finally(() => setLoadingI(false));
    } else {
      inquiryService.getSent()
        .then(({ inquiries: list }) => setSentInquiries(list))
        .catch(() => {})
        .finally(() => setLoadingI(false));
    }
    agentService.getMe()
      .then((p) => {
        if (p) {
          setAgentProfile(p);
          setAgentForm({ agencyName: p.agencyName ?? '', bio: p.bio ?? '', licenseNumber: p.licenseNumber ?? '' });
        }
      })
      .catch(() => {});

    if (canPost(user.role)) {
      agentService.getStats()
        .then(setAgentStats)
        .catch(() => {});
    }

    if (!canPost(user.role)) {
      setSavedSearchLoading(true);
      savedSearchService.getAll()
        .then(setSavedSearches)
        .catch(() => {})
        .finally(() => setSavedSearchLoading(false));
    }

    if (user.role === 'builder') {
      setProjectsLoading(true);
      projectService.getMine()
        .then(setProjects)
        .catch(() => {})
        .finally(() => setProjectsLoading(false));
    }

    const poll = canPost(user.role)
      ? setInterval(() => {
          inquiryService.getAll()
            .then(({ inquiries: list, unreadCount }) => { setInquiries(list); setUnread(unreadCount); })
            .catch(() => {});
        }, 10_000)
      : setInterval(() => {
          inquiryService.getSent()
            .then(({ inquiries: list }) => setSentInquiries(list))
            .catch(() => {});
        }, 10_000);

    return () => clearInterval(poll);
  }, [user, authLoading]);

  // When the poll detects a newly-unread inquiry that's already open, refresh its messages
  useEffect(() => {
    if (!expandedId) return;
    const expanded = inquiries.find((q) => q.id === expandedId);
    if (!expanded || expanded.is_read) return;
    inquiryService.getMessages(expandedId)
      .then(({ messages }) => setThreadMap((prev) => ({ ...prev, [expandedId]: messages })))
      .catch(() => {});
  }, [inquiries]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab !== 'enquiries' || !user || canPost(user.role)) return;
    const withReplies = sentInquiries.filter((q) => q.reply_message && q.replied_at);
    if (!withReplies.length) return;
    setSeenReplies((prev) => {
      const next = { ...prev };
      withReplies.forEach((q) => { next[q.id] = q.replied_at!; });
      try { localStorage.setItem('estatero_seen_replies', JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, [tab, user]); // intentionally excludes sentInquiries — must only run when tab opens, not on every poll

  if (authLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-surface-bright">
      <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
    </div>
  );

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

  const toggleExpand = async (id: number, markRead?: Inquiry) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    setMsgDraft('');
    setMsgErr('');
    if (markRead) handleMarkRead(markRead);
    if (!threadMap[id]) {
      setThreadLoading(true);
      try {
        const { messages } = await inquiryService.getMessages(id);
        setThreadMap((prev) => ({ ...prev, [id]: messages }));
      } catch { /* silent */ }
      finally { setThreadLoading(false); }
    }
  };

  const handleSendMessage = async (inquiryId: number, senderIsAgent: boolean) => {
    if (!msgDraft.trim()) { setMsgErr('Message cannot be empty.'); return; }
    setMsgSending(true); setMsgErr('');
    try {
      const { message } = await inquiryService.sendMessage(inquiryId, msgDraft.trim());
      setThreadMap((prev) => ({ ...prev, [inquiryId]: [...(prev[inquiryId] ?? []), message] }));
      setMsgDraft('');
      if (senderIsAgent) {
        setInquiries((prev) => prev.map((q) =>
          q.id === inquiryId ? { ...q, reply_message: message.content, replied_at: message.created_at, is_read: true } : q,
        ));
      } else {
        setSentInquiries((prev) => prev.map((q) =>
          q.id === inquiryId ? { ...q, reply_message: q.reply_message } : q,
        ));
      }
    } catch (err) {
      setMsgErr((err as Error).message);
    } finally {
      setMsgSending(false);
    }
  };

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setAddingProject(true);
    try {
      const p = await projectService.create({ name: newProjectName.trim(), description: newProjectDesc || undefined, city: newProjectCity || undefined });
      setProjects((prev) => [p, ...prev]);
      setNewProjectName(''); setNewProjectDesc(''); setNewProjectCity('');
      setShowAddProject(false);
    } catch { /* silent */ }
    finally { setAddingProject(false); }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await projectService.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch { /* silent */ }
  };

  const openEditProject = (p: Project) => {
    setEditingProject(p);
    setEditProjectName(p.name);
    setEditProjectDesc(p.description ?? '');
    setEditProjectCity(p.city ?? '');
    setEditProjectStatus(p.status ?? 'ongoing');
  };

  const handleEditProjectSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editProjectName.trim()) return;
    setSavingProject(true);
    try {
      const updated = await projectService.update(editingProject.id, {
        name:        editProjectName.trim(),
        description: editProjectDesc || undefined,
        city:        editProjectCity || undefined,
        status:      editProjectStatus || undefined,
      });
      setProjects((prev) => prev.map((p) => p.id === editingProject.id ? { ...p, ...updated } : p));
      setEditingProject(null);
    } catch { /* silent */ }
    finally { setSavingProject(false); }
  };

  const handleDeleteSavedSearch = async (id: number) => {
    try {
      await savedSearchService.delete(id);
      setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    } catch { /* silent */ }
  };

  const handleLinkProject = async (propertyId: Property['id'], projectId: number | null) => {
    setLinkingSaving(true);
    try {
      const updated = await propertyService.update(propertyId, { project_id: projectId ?? undefined });
      setListings((prev) => prev.map((p) => p.id === propertyId ? updated : p));
      setLinkingProjectId(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLinkingSaving(false);
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

  const handleAgentSave = async (e: FormEvent) => {
    e.preventDefault();
    setAgentSaving(true); setAgentErr('');
    try {
      const updated = await agentService.updateMe({
        agencyName:    agentForm.agencyName    || null,
        bio:           agentForm.bio           || null,
        licenseNumber: agentForm.licenseNumber || null,
        profileImage:  agentProfile?.profileImage ?? null,
      });
      setAgentProfile(updated);
      setEditingAgent(false);
    } catch (err) {
      setAgentErr((err as Error).message);
    } finally {
      setAgentSaving(false);
    }
  };

  const handleAgentAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAgentAvatarUploading(true);
    try {
      const url = await uploadSingleFile(file);
      const updated = await agentService.updateMe({
        agencyName:    agentProfile?.agencyName    ?? null,
        bio:           agentProfile?.bio           ?? null,
        licenseNumber: agentProfile?.licenseNumber ?? null,
        profileImage:  url,
      });
      setAgentProfile(updated);
    } catch (err) {
      setAgentErr((err as Error).message);
    } finally {
      setAgentAvatarUploading(false);
      if (agentAvatarRef.current) agentAvatarRef.current.value = '';
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

            {canPost(user.role) && (
              <button
                onClick={() => navigate('/post-property')}
                className="flex-shrink-0 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-container transition-colors"
              >
                + Post Property
              </button>
            )}
          </div>
        </div>

        {/* Role Profile card — hidden for buyers */}
        {canPost(user.role) && (() => {
          const roleLabels = ROLE_PROFILE_LABELS[user.role as PostingRole];
          return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">real_estate_agent</span>
              {roleLabels.section}
            </h2>
            {agentProfile && !editingAgent && (
              <button
                onClick={() => setEditingAgent(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Edit
              </button>
            )}
          </div>

          {editingAgent ? (
            <form onSubmit={handleAgentSave} className="space-y-4 max-w-lg">
              {roleLabels.showCompany && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">{roleLabels.companyLabel}</label>
                  <input
                    value={agentForm.agencyName}
                    onChange={(e) => setAgentForm((f) => ({ ...f, agencyName: e.target.value }))}
                    placeholder={user.role === 'builder' ? 'e.g. Prestige Group' : 'e.g. Sunrise Realty'}
                    className={inputCls}
                  />
                </div>
              )}
              {roleLabels.showLicense && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">{roleLabels.licenseLabel}</label>
                  <input
                    value={agentForm.licenseNumber}
                    onChange={(e) => setAgentForm((f) => ({ ...f, licenseNumber: e.target.value }))}
                    placeholder="e.g. RERA12345678"
                    className={inputCls}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={agentForm.bio}
                  onChange={(e) => setAgentForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder={roleLabels.bioPlaceholder}
                  className={inputCls + ' resize-none'}
                />
              </div>
              {agentErr && <p className="text-sm text-red-600">{agentErr}</p>}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={agentSaving}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {agentSaving ? 'Saving…' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingAgent(false); setAgentErr(''); }}
                  className="text-sm font-semibold text-on-surface-variant px-4 hover:text-on-surface"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : agentProfile ? (
            <div className="flex items-start gap-6 flex-wrap">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                  {agentProfile.profileImage ? (
                    <img src={agentProfile.profileImage} alt="Agent avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-primary text-4xl">person</span>
                  )}
                </div>
                <button
                  onClick={() => agentAvatarRef.current?.click()}
                  disabled={agentAvatarUploading}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  {agentAvatarUploading
                    ? <span className="material-symbols-outlined text-[12px] animate-spin text-primary">progress_activity</span>
                    : <span className="material-symbols-outlined text-[12px] text-on-surface-variant">photo_camera</span>
                  }
                </button>
                <input ref={agentAvatarRef} type="file" accept="image/*" className="hidden" onChange={handleAgentAvatarChange} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {agentProfile.agencyName && (
                    <p className="text-sm font-bold text-on-surface">{agentProfile.agencyName}</p>
                  )}
                  {agentProfile.isVerified && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      Verified
                    </span>
                  )}
                </div>
                {agentProfile.licenseNumber && (
                  <p className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">badge</span>
                    {agentProfile.licenseNumber}
                  </p>
                )}
                {agentProfile.bio && (
                  <p className="text-sm text-on-surface-variant leading-relaxed mt-2">{agentProfile.bio}</p>
                )}
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-amber-500">star</span>
                    <span className="text-sm font-bold text-on-surface">{agentProfile.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">home</span>
                    {agentProfile.listingsCount} active {agentProfile.listingsCount === 1 ? 'listing' : 'listings'}
                  </div>
                  {agentProfile.responseRate != null && (
                    <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">reply</span>
                      {agentProfile.responseRate}% response rate
                    </div>
                  )}
                  {agentProfile.avgResponseHours != null && (
                    <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      Avg {agentProfile.avgResponseHours < 1 ? `${Math.round(agentProfile.avgResponseHours * 60)}min` : `${Math.round(agentProfile.avgResponseHours)}h`} reply
                    </div>
                  )}
                </div>
              </div>

              {agentErr && <p className="text-sm text-red-600 w-full">{agentErr}</p>}
            </div>
          ) : (
            <div className="flex flex-col items-start gap-4">
              <p className="text-sm text-on-surface-variant">
                {user.role === 'agent'
                  ? 'Create an agent profile to appear in the agents directory and build buyer trust.'
                  : user.role === 'builder'
                  ? 'Add your company profile so buyers can discover your projects.'
                  : 'Add a short bio so buyers know they are dealing directly with the owner.'}
              </p>
              <button
                onClick={() => setEditingAgent(true)}
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
              >
                Set Up {roleLabels.section}
              </button>
            </div>
          )}
        </div>
          );
        })()}

        {/* Tabs */}
        <div className="flex border-b border-outline-variant mb-6 overflow-x-auto">
          {(canPost(user.role)
            ? (['listings', 'saved', 'enquiries', 'stats', ...(user.role === 'builder' ? ['projects'] : [])] as Tab[])
            : (['saved', 'enquiries', 'searches', 'history'] as Tab[])
          ).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'relative px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0',
                tab === t
                  ? 'text-primary border-b-2 border-primary -mb-px'
                  : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              {t === 'listings'  && `My Listings (${listings.length})`}
              {t === 'saved'     && `Saved (${savedProperties.length})`}
              {t === 'searches'  && `Saved Searches (${savedSearches.length})`}
              {t === 'history'   && 'Viewed History'}
              {t === 'stats'     && 'Analytics'}
              {t === 'projects'  && `Projects (${projects.length})`}
              {t === 'enquiries' && (
                <>
                  {canPost(user.role)
                    ? `Enquiries (${inquiries.length})`
                    : `My Enquiries (${sentInquiries.length})`}
                  {canPost(user.role) && unread > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                  {!canPost(user.role) && (() => {
                    const n = sentInquiries.filter((q) => q.reply_message && q.replied_at && (!seenReplies[q.id] || seenReplies[q.id] < q.replied_at)).length;
                    return n > 0 ? (
                      <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold">
                        {n > 99 ? '99+' : n}
                      </span>
                    ) : null;
                  })()}
                </>
              )}
            </button>
          ))}
        </div>

        {/* ── Stats tab ── */}
        {tab === 'stats' && (
          agentStats ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: 'visibility',    label: 'Total Views',    value: agentStats.totalViews.toLocaleString('en-IN') },
                { icon: 'home',          label: 'Total Listings', value: agentStats.totalListings.toString() },
                { icon: 'forum',         label: 'Enquiries',      value: agentStats.totalEnquiries.toString() },
                { icon: 'trending_up',   label: 'Response Rate',  value: agentStats.responseRate != null ? `${agentStats.responseRate}%` : 'N/A' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
                  <p className="text-2xl font-extrabold text-on-surface">{value}</p>
                  <p className="text-xs text-on-surface-variant">{label}</p>
                </div>
              ))}
              {agentStats.avgResponseHours != null && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 col-span-2 sm:col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                    <p className="text-sm font-semibold text-on-surface-variant">Avg Response Time</p>
                  </div>
                  <p className="text-xl font-extrabold text-on-surface">
                    {agentStats.avgResponseHours < 1
                      ? `${Math.round(agentStats.avgResponseHours * 60)} min`
                      : `${Math.round(agentStats.avgResponseHours)} hrs`}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center py-20">
              <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
            </div>
          )
        )}

        {/* ── Projects tab (builder only) ── */}
        {tab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-on-surface">Your Projects</h3>
              <button
                onClick={() => setShowAddProject((v) => !v)}
                className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                New Project
              </button>
            </div>

            {showAddProject && (
              <form onSubmit={handleAddProject} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Project Name *</label>
                  <input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g. Lodha Bellagio" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">City</label>
                  <input value={newProjectCity} onChange={(e) => setNewProjectCity(e.target.value)} placeholder="e.g. Mumbai" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Description</label>
                  <textarea rows={2} value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} className={inputCls + ' resize-none'} />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={addingProject} className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
                    {addingProject ? 'Creating…' : 'Create Project'}
                  </button>
                  <button type="button" onClick={() => setShowAddProject(false)} className="text-sm font-semibold text-on-surface-variant px-3">Cancel</button>
                </div>
              </form>
            )}

            {projectsLoading ? (
              <div className="flex justify-center py-12"><span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span></div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center py-20 gap-4 text-center">
                <span className="material-symbols-outlined text-outline text-7xl">apartment</span>
                <h3 className="text-lg font-bold text-on-surface">No projects yet</h3>
                <p className="text-body-md text-on-surface-variant">Create a project to group related listings together.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
                    {editingProject?.id === p.id ? (
                      <form onSubmit={handleEditProjectSave} className="space-y-3">
                        <input
                          value={editProjectName}
                          onChange={(e) => setEditProjectName(e.target.value)}
                          className={inputCls}
                          placeholder="Project name"
                          required
                        />
                        <input
                          value={editProjectCity}
                          onChange={(e) => setEditProjectCity(e.target.value)}
                          className={inputCls}
                          placeholder="City"
                        />
                        <textarea
                          rows={2}
                          value={editProjectDesc}
                          onChange={(e) => setEditProjectDesc(e.target.value)}
                          className={inputCls + ' resize-none'}
                          placeholder="Description"
                        />
                        <select
                          value={editProjectStatus}
                          onChange={(e) => setEditProjectStatus(e.target.value)}
                          className={selectCls}
                        >
                          <option value="ongoing">Ongoing</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="completed">Completed</option>
                        </select>
                        <div className="flex gap-2">
                          <button type="submit" disabled={savingProject} className="flex-1 bg-primary text-white py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50">
                            {savingProject ? 'Saving…' : 'Save'}
                          </button>
                          <button type="button" onClick={() => setEditingProject(null)} className="flex-1 border border-outline-variant py-1.5 rounded-lg text-sm font-semibold text-on-surface-variant">
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-on-surface text-sm leading-tight">{p.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            p.status === 'completed' ? 'bg-green-100 text-green-700'
                            : p.status === 'upcoming' ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                          }`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                        </div>
                        {p.city && <p className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">location_on</span>{p.city}</p>}
                        {p.description && <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{p.description}</p>}
                        <p className="text-xs text-on-surface-variant">{p.property_count ?? 0} {p.property_count === 1 ? 'unit' : 'units'} linked</p>
                        <div className="flex gap-3 mt-1">
                          <button
                            onClick={() => openEditProject(p)}
                            className="text-xs text-primary hover:underline font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="text-xs text-red-500 hover:underline font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Saved Searches tab (buyer) ── */}
        {tab === 'searches' && (
          savedSearchLoading ? (
            <div className="flex justify-center py-20"><span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span></div>
          ) : savedSearches.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4 text-center">
              <span className="material-symbols-outlined text-outline text-7xl">search</span>
              <h3 className="text-lg font-bold text-on-surface">No saved searches</h3>
              <p className="text-body-md text-on-surface-variant">Save a search on the listings page to get quick access to it later.</p>
              <button onClick={() => navigate('/listings')} className="mt-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold">Browse Listings</button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedSearches.map((s) => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">{s.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {[s.filters.city, s.filters.status, (s.filters.propertyTypes ?? []).join(', ')].filter(Boolean).join(' · ') || 'All properties'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{timeAgo(s.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        const params = new URLSearchParams();
                        if (s.filters.city) params.set('city', s.filters.city);
                        if (s.filters.status) params.set('type', s.filters.status);
                        navigate(`/listings?${params.toString()}`);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <span className="material-symbols-outlined text-[14px]">search</span>
                      Apply
                    </button>
                    <button
                      onClick={() => handleDeleteSavedSearch(s.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:underline"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Viewed History tab (buyer) ── */}
        {tab === 'history' && (
          viewedHistory.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4 text-center">
              <span className="material-symbols-outlined text-outline text-7xl">history</span>
              <h3 className="text-lg font-bold text-on-surface">No properties viewed yet</h3>
              <p className="text-body-md text-on-surface-variant">Properties you view will appear here for quick access.</p>
              <button onClick={() => navigate('/listings')} className="mt-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold">Browse Properties</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-on-surface-variant">{viewedHistory.length} properties viewed</p>
                <button
                  onClick={() => { setViewedHistory([]); localStorage.removeItem('estatero_viewed'); }}
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  Clear History
                </button>
              </div>
              {viewedHistory.map((item) => (
                <button
                  key={`${item.id}-${item.viewedAt}`}
                  onClick={() => navigate(`/property/${item.id}`)}
                  className="w-full bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4 text-left hover:border-primary/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-on-surface text-sm">{item.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {item.location}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-primary">₹{item.price.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-on-surface-variant">{timeAgo(item.viewedAt)}</p>
                  </div>
                </button>
              ))}
            </div>
          )
        )}

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
              {canPost(user.role) && (
                <button onClick={() => navigate('/post-property')} className="mt-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold">
                  Post Your First Property
                </button>
              )}
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

                  {/* Builder: Link to Project */}
                  {user.role === 'builder' && (
                    <div className="mt-2 px-1">
                      {linkingProjectId === p.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            autoFocus
                            defaultValue={p.projectId ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleLinkProject(p.id, val === '' ? null : Number(val));
                            }}
                            disabled={linkingSaving}
                            className="flex-1 border border-primary rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                          >
                            <option value="">— No project (standalone) —</option>
                            {projects.map((proj) => (
                              <option key={proj.id} value={proj.id}>{proj.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setLinkingProjectId(null)}
                            disabled={linkingSaving}
                            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface px-2"
                          >
                            {linkingSaving ? '…' : 'Cancel'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setLinkingProjectId(p.id)}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-outline-variant text-xs font-semibold text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">domain</span>
                          {p.projectName ? `Project: ${p.projectName}` : 'Link to Project'}
                        </button>
                      )}
                    </div>
                  )}

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
              {savedProperties.map((p) => {
                const drop = p.priceAtSave && p.priceAtSave > p.price
                  ? p.priceAtSave - p.price
                  : null;
                return (
                  <div key={p.id} className="relative">
                    {drop !== null && (
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-[12px]">trending_down</span>
                        Price dropped ₹{drop.toLocaleString('en-IN')}
                      </div>
                    )}
                    <PropertyCard
                      property={p}
                      onCardClick={(id) => navigate(`/property/${id}`)}
                      onFavourite={savedToggle}
                    />
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* ── Enquiries tab ── */
          loadingI ? (
            <div className="flex justify-center py-20">
              <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
            </div>
          ) : !canPost(user.role) ? (
            /* ── Buyer: sent enquiries + replies ── */
            sentInquiries.length === 0 ? (
              <div className="flex flex-col items-center py-20 gap-4 text-center">
                <span className="material-symbols-outlined text-outline text-7xl">forum</span>
                <h3 className="text-lg font-bold text-on-surface">No enquiries sent yet</h3>
                <p className="text-body-md text-on-surface-variant">Enquiries you send on property listings will appear here along with replies.</p>
                <button onClick={() => navigate('/listings')} className="mt-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold">Browse Properties</button>
              </div>
            ) : (
              <div className="space-y-3">
                {sentInquiries.map((q) => {
                  const isExpanded  = expandedId === q.id;
                  const thread      = threadMap[q.id];
                  const hasNewReply = !!(q.reply_message && q.replied_at && (!seenReplies[q.id] || seenReplies[q.id] < q.replied_at));
                  const propInitials = (q.property_title ?? 'P')
                    .split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
                  return (
                    <div key={q.id} className={`bg-white rounded-xl border overflow-hidden transition-colors ${hasNewReply ? 'border-primary bg-primary/5' : 'border-gray-100'}`}>

                      <button
                        className="w-full text-left px-5 pt-4 pb-3 flex items-start justify-between gap-4"
                        onClick={() => toggleExpand(q.id)}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                            {q.property_title
                              ? propInitials
                              : <span className="material-symbols-outlined text-[18px]">home</span>
                            }
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                              {q.property_title ?? 'Property Enquiry'}
                              {hasNewReply && (
                                <>
                                  <span className="inline-block w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                  <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">New Reply</span>
                                </>
                              )}
                              {!q.reply_message && (
                                <span className="text-[10px] font-semibold text-on-surface-variant bg-gray-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <span className="material-symbols-outlined text-[10px]">schedule</span>
                                  Awaiting
                                </span>
                              )}
                            </p>

                            <div className="flex items-center gap-2 flex-wrap mt-0.5">
                              {(q.property_city || q.property_location) && (
                                <span className="flex items-center gap-0.5 text-xs text-on-surface-variant">
                                  <span className="material-symbols-outlined text-[12px]">location_on</span>
                                  {[q.property_city, q.property_location].filter(Boolean).join(' · ')}
                                </span>
                              )}
                              {q.responder_name && (
                                <span className="text-xs text-on-surface-variant">
                                  · {q.responder_name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-on-surface-variant">{timeAgo(q.created_at)}</span>
                          <span className={`material-symbols-outlined text-on-surface-variant text-[20px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 border-t border-gray-100">
                          <div className="pt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                            {threadLoading && !thread ? (
                              <div className="flex justify-center py-6">
                                <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                              </div>
                            ) : (thread ?? []).map((m) => {
                              const isMine = m.sender_type === 'buyer';
                              return (
                                <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl ${isMine ? 'bg-primary text-white rounded-br-sm' : 'bg-gray-100 text-on-surface rounded-bl-sm'}`}>
                                    <p className={`text-[10px] font-semibold mb-1 ${isMine ? 'text-white/70' : 'text-on-surface-variant'}`}>
                                      {isMine ? 'You' : (m.sender_name ?? 'Agent')} · {timeAgo(m.created_at)}
                                    </p>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-4 border-t border-gray-100 mt-4">
                            <textarea
                              rows={2}
                              value={msgDraft}
                              onChange={(e) => setMsgDraft(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSendMessage(q.id, false); }}
                              placeholder="Follow up… (Ctrl+Enter to send)"
                              className="w-full border border-outline-variant rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            />
                            {msgErr && <p className="text-xs text-red-600 mt-1">{msgErr}</p>}
                            <div className="flex items-center justify-between mt-2">
                              {q.property_id ? (
                                <button
                                  onClick={() => navigate(`/property/${q.property_id}`)}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                  View Property
                                </button>
                              ) : <span />}
                              <button
                                onClick={() => handleSendMessage(q.id, false)}
                                disabled={msgSending}
                                className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[16px]">send</span>
                                {msgSending ? 'Sending…' : 'Send'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : inquiries.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-4 text-center">
              <span className="material-symbols-outlined text-outline text-7xl">mark_email_unread</span>
              <h3 className="text-lg font-bold text-on-surface">No enquiries yet</h3>
              <p className="text-body-md text-on-surface-variant">When someone sends an enquiry on your listings, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((q) => {
                const isExpanded = expandedId === q.id;
                const thread     = threadMap[q.id];
                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-xl border overflow-hidden transition-colors ${q.is_read ? 'border-gray-100' : 'border-primary bg-primary/5'}`}
                  >
                    {/* Card header */}
                    <button
                      className="w-full text-left px-5 pt-4 pb-3 flex items-start justify-between gap-4"
                      onClick={() => toggleExpand(q.id, q)}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {q.sender_name
                            ? q.sender_name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
                            : <span className="material-symbols-outlined text-[18px]">person</span>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                            {q.sender_name ?? 'Anonymous'}
                            {!q.is_read && (
                              <>
                                <span className="inline-block w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">New</span>
                              </>
                            )}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap mt-0.5">
                            {q.sender_email && (
                              <a href={`mailto:${q.sender_email}`} onClick={(e) => e.stopPropagation()} className="text-xs text-primary hover:underline">
                                {q.sender_email}
                              </a>
                            )}
                            {q.sender_phone && (
                              <a href={`tel:${q.sender_phone}`} onClick={(e) => e.stopPropagation()} className="text-xs text-primary hover:underline flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">call</span>
                                {q.sender_phone}
                              </a>
                            )}
                          </div>
                          {q.property_title && (
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/property/${q.property_id}`); }}
                              className="mt-1 flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary"
                            >
                              <span className="material-symbols-outlined text-[13px]">home</span>
                              <span className="truncate">{q.property_title}{q.property_city ? ` · ${q.property_city}` : ''}</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-on-surface-variant">{timeAgo(q.created_at)}</span>
                        <span className={`material-symbols-outlined text-on-surface-variant text-[20px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </div>
                    </button>

                    {/* Expanded thread */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="pt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                          {threadLoading && !thread ? (
                            <div className="flex justify-center py-6">
                              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                            </div>
                          ) : (thread ?? []).map((m) => {
                            const isMine = m.sender_type === 'agent';
                            return (
                              <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl ${isMine ? 'bg-primary text-white rounded-br-sm' : 'bg-gray-100 text-on-surface rounded-bl-sm'}`}>
                                  <p className={`text-[10px] font-semibold mb-1 ${isMine ? 'text-white/70' : 'text-on-surface-variant'}`}>
                                    {isMine ? 'You' : (m.sender_name ?? 'Buyer')} · {timeAgo(m.created_at)}
                                  </p>
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Compose */}
                        <div className="pt-4 border-t border-gray-100 mt-4">
                          <textarea
                            autoFocus
                            rows={2}
                            value={msgDraft}
                            onChange={(e) => setMsgDraft(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSendMessage(q.id, true); }}
                            placeholder="Reply… (Ctrl+Enter to send)"
                            className="w-full border border-outline-variant rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          />
                          {msgErr && <p className="text-xs text-red-600 mt-1">{msgErr}</p>}
                          <div className="flex items-center justify-between mt-2">
                            {q.sender_phone ? (
                              <a href={`tel:${q.sender_phone}`} className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary">
                                <span className="material-symbols-outlined text-[14px]">call</span>
                                Call Back
                              </a>
                            ) : <span />}
                            <button
                              onClick={() => handleSendMessage(q.id, true)}
                              disabled={msgSending}
                              className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[16px]">send</span>
                              {msgSending ? 'Sending…' : 'Send Reply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
