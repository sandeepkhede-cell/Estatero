import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';

interface NavLink {
  label: string;
  to?: string;
  href?: string;
}

interface HeaderProps {
  brandName?: string;
  navLinks?: NavLink[];
  onPostProperty?: () => void;
}

const defaultNavLinks: NavLink[] = [
  { label: 'Buy',        to: '/listings' },
  { label: 'Rent',       to: '/listings?type=for_rent' },
  { label: 'Commercial', to: '/listings?pt=commercial' },
  { label: 'PG',         to: '/listings?type=pg' },
  { label: 'Find Agent', to: '/agents' },
];

const Header = ({
  brandName = 'Estatero',
  navLinks = defaultNavLinks,
  onPostProperty,
}: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (link: NavLink) =>
    link.to ? location.pathname === link.to : false;

  const showInlineSearch = location.pathname !== '/listings';

  const initials = user?.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-[1200px] mx-auto font-manrope antialiased">

        <Link to="/" className="text-xl font-extrabold text-primary tracking-tight">
          {brandName}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className={
                  isActive(link)
                    ? 'text-primary border-b-2 border-primary font-semibold pb-1 transition-colors'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary transition-colors pb-1'
                }
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href ?? '#'}
                className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-4">
          {showInlineSearch && (
            <div className="hidden lg:flex items-center bg-surface-container rounded-full px-4 py-1.5 border border-outline-variant">
              <span className="material-symbols-outlined text-outline text-xl">search</span>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:ring-0 text-body-sm w-32 outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/saved')}
              className="material-symbols-outlined text-on-surface-variant hover:bg-gray-50 p-2 rounded-full transition-all"
            >
              favorite
            </button>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 hover:bg-gray-50 rounded-full pl-1 pr-3 py-1 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {initials}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="material-symbols-outlined text-gray-400 text-[18px]">
                    expand_more
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/profile'); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      My Profile
                    </button>
                    <button
                      onClick={() => { navigate('/saved'); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                      Saved Properties
                    </button>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                <span className="hidden sm:block">Sign In</span>
              </button>
            )}

            <button
              onClick={() => {
                onPostProperty?.();
                if (user) navigate('/post-property');
                else openAuthModal('register');
              }}
              className="hidden sm:block bg-primary-container text-on-primary font-label-bold px-4 py-2 rounded-lg hover:bg-primary transition-all"
            >
              Post Property
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
