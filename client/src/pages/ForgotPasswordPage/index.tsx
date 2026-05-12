import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const inputCls = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

const ForgotPasswordPage = () => {
  const navigate    = useNavigate();
  const [email,    setEmail]    = useState('');
  const [busy,     setBusy]     = useState(false);
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address'); return; }
    setBusy(true); setError('');
    try {
      await authService.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex-grow bg-surface-bright flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-primary px-8 py-5">
            <p className="text-white text-xl font-extrabold tracking-tight">Estatero</p>
            <p className="text-red-100 text-xs mt-0.5">Reset your password</p>
          </div>

          <div className="px-8 py-8">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-green-500 text-4xl">mark_email_read</span>
                </div>
                <h2 className="text-lg font-bold text-on-surface">Check your inbox</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  If <span className="font-semibold text-on-surface">{email}</span> is registered,
                  you'll receive a reset link shortly. It expires in 1 hour.
                </p>
                <p className="text-xs text-on-surface-variant">
                  Didn't get it? Check your spam folder or{' '}
                  <button
                    onClick={() => { setSent(false); setEmail(''); }}
                    className="text-primary font-semibold hover:underline"
                  >
                    try again
                  </button>.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-2 w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-on-surface mb-1">Forgot your password?</h2>
                  <p className="text-sm text-on-surface-variant">
                    Enter your account email and we'll send you a reset link.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
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
                  Send Reset Link
                </button>

                <p className="text-center text-sm text-gray-500">
                  Remember it?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Back to Sign In
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
