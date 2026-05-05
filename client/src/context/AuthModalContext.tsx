import { createContext, useContext, useState, ReactNode } from 'react';

type AuthModalTab = 'login' | 'register';

interface AuthModalContextValue {
  isOpen:    boolean;
  tab:       AuthModalTab;
  open:      (tab?: AuthModalTab) => void;
  close:     () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab,    setTab]    = useState<AuthModalTab>('login');

  const open  = (t: AuthModalTab = 'login') => { setTab(t); setIsOpen(true); };
  const close = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, tab, open, close }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
};
