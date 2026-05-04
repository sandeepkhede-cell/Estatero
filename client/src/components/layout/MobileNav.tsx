import { useNavigate, useLocation } from 'react-router-dom';

interface NavTab {
  label: string;
  icon: string;
  path?: string;
  onClick?: () => void;
}

interface MobileNavProps {
  tabs?: NavTab[];
}

const defaultTabs: NavTab[] = [
  { label: 'Home',     icon: 'home',       path: '/' },
  { label: 'Saved',    icon: 'favorite',   path: '/saved' },
  { label: 'Post',     icon: 'add_circle' },
  { label: 'Profile',  icon: 'person' },
];

const MobileNav = ({ tabs = defaultTabs }: MobileNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (tab: NavTab) => !!tab.path && location.pathname === tab.path;

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-2 pb-6 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md z-50 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_10px_0_rgba(0,0,0,0.03)] md:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => tab.path ? navigate(tab.path) : tab.onClick?.()}
          className={`flex flex-col items-center justify-center scale-95 transition-transform duration-100 ${
            isActive(tab) ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={isActive(tab) ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            {tab.icon}
          </span>
          <span className="font-manrope text-[11px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
