import { useState, FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuthModal } from '../../context/AuthModalContext';

const inputCls = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

const ResetPasswordPage = () => {
  const [searchParams]  = useSearchParams();
  const navigate         = useNavigate();
  const { open }         = useAuthModal();

  const token = searchParams.get('token') ?? '';

  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [busy,      setBusy]      = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setBusy(true); setError('');
    try {
      await authService.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <main className="flex-grow bg-surface-bright flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-outline text-7xl">link_off</span>
          <h2 className="text-lg font-bold text-on-surface">Invalid reset link</h2>
          <p className="text-sm text-on-surface-variant">This link is missing a token. Please request a new one.</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold"
          >
            Request Reset Link
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-surface-bright flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-primary px-8 py-5">
            <p className="text-white text-xl font-extrabold tracking-tight">Estatero</p>
            <p className="text-red-100 text-xs mt-0.5">Set a new password</p>
          </div>

          <div className="px-8 py-8">
            {done ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                </div>
                <h2 className="text-lg font-bold text-on-surface">Password updated!</h2>
                <p className="text-sm text-on-surface-variant">
                  Your password has been changed. You can now sign in with your new password.
                </p>
                <button
                  onClick={() => { navigate('/'); open('login'); }}
                  className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-on-surface mb-1">Choose a new password</h2>
                  <p className="text-sm text-on-surface-variant">Must be at least 8 characters.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    autoFocus
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={inputCls}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-primary hover:opacity-90 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-opacity flex items-center justify-center gap-2"
                >
                  {busy && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
