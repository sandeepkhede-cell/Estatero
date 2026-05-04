import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { agentService } from '../../services/agentService';
import type { Agent } from '../../types/property';

interface ContactModalProps {
  agent:         Agent;
  propertyId?:   number | string;
  propertyTitle: string;
  mode:          'contact' | 'inquiry';
  onClose:       () => void;
}

const ContactModal = ({ agent, propertyId, propertyTitle, mode, onClose }: ContactModalProps) => {
  const { user } = useAuth();

  const [name,    setName]    = useState(user?.name  ?? '');
  const [email,   setEmail]   = useState(user?.email ?? '');
  const [phone,   setPhone]   = useState('');
  const [message, setMessage] = useState(`Hi, I am interested in "${propertyTitle}". Please get in touch with me.`);
  const [busy,    setBusy]    = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  // Sync auth fields if user signs in while modal is open
  useEffect(() => {
    if (user) {
      setName((n)  => n  || user.name);
      setEmail((e) => e  || user.email);
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) { setError('Please enter a message'); return; }
    setError('');
    setBusy(true);
    try {
      await agentService.contact(agent.id, { name, email, phone, message, propertyId });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const title = mode === 'contact' ? 'Contact Agent' : 'Send Inquiry';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-gray-500">close</span>
          </button>
        </div>

        {done ? (
          /* Success state */
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Inquiry Sent!</p>
              <p className="text-sm text-gray-500 mt-1">
                {agent.name} will get back to you shortly.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 bg-blue-600 text-white font-semibold px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Agent info strip */}
            <div className="px-6 py-3 bg-blue-50 flex items-center gap-3 border-b border-blue-100">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {agent.avatar
                  ? <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                  : <span className="material-symbols-outlined text-gray-400 text-[24px] m-auto">person</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{agent.name}</p>
                <p className="text-xs text-gray-500 truncate">{agent.role}</p>
              </div>
              {agent.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  Call
                </a>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {busy && (
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                )}
                {title}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
