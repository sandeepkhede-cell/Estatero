import { useState, FormEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';

type Tab = 'login' | 'register';

const inputCls = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

const AuthModal = () => {
  const { login, register } = useAuth();
  const { isOpen, tab: initialTab, close } = useAuthModal();

  const [tab,      setTab]      = useState<Tab>(initialTab);
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [busy,     setBusy]     = useState(false);

  // Sync tab when modal opens with a specific tab
  useEffect(() => { if (isOpen) setTab(initialTab); }, [isOpen, initialTab]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else        document.body.style.overflow = '';
    return ()  => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const switchTab = (t: Tab) => { setTab(t); setError(''); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (tab === 'register') {
      if (!name.trim())         { setError('Name is required'); return; }
      if (password !== confirm) { setError('Passwords do not match'); return; }
      if (password.length < 8)  { setError('Password must be at least 8 characters'); return; }
    }
    setBusy(true);
    try {
      if (tab === 'login') await login({ email, password });
      else                 await register({ name: name.trim(), email, password });
      // Reset and close on success
      setName(''); setEmail(''); setPassword(''); setConfirm('');
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-primary px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-white text-xl font-extrabold tracking-tight">Estatero</p>
            <p className="text-red-100 text-xs mt-0.5">Find your perfect property</p>
          </div>
          <button onClick={close} className="text-white/80 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(['login', 'register'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors capitalize ${
                tab === t
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className={inputCls} />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={tab === 'register' ? 'Min. 8 characters' : '••••••••'} required className={inputCls} />
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Confirm Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required className={inputCls} />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary hover:bg-primary-container disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {busy && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => switchTab(tab === 'login' ? 'register' : 'login')} className="text-primary font-semibold hover:underline">
              {tab === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default AuthModal;
