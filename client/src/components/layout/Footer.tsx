interface FooterLink {
  label: string;
  href?: string;
}

interface SocialLink {
  icon: string;
  href?: string;
  onClick?: () => void;
}

interface FooterProps {
  brandName?: string;
  tagline?: string;
  navLinks?: FooterLink[];
  copyrightText?: string;
  socialLinks?: SocialLink[];
}

const defaultNavLinks: FooterLink[] = [
  { label: 'About Us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Terms', href: '#' },
];

const defaultSocialLinks: SocialLink[] = [
  { icon: 'social_leaderboard' },
  { icon: 'language' },
  { icon: 'alternate_email' },
];

const Footer = ({
  brandName = 'Estatero',
  tagline = 'Empowering property seekers with transparent data and seamless search experiences.',
  navLinks = defaultNavLinks,
  copyrightText = `© ${new Date().getFullYear()} Estatero Real Estate. All rights reserved.`,
  socialLinks = defaultSocialLinks,
}: FooterProps) => (
  <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 w-full mt-auto">
    <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 font-manrope text-sm text-gray-600 dark:text-gray-400">

      <div className="flex flex-col items-center md:items-start gap-2">
        <div className="text-lg font-bold text-gray-900 dark:text-white">{brandName}</div>
        <p className="max-w-xs text-center md:text-left text-xs opacity-70">{tagline}</p>
      </div>

      <nav className="flex flex-wrap justify-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href ?? '#'}
            className="text-gray-500 hover:text-blue-600 hover:underline transition-all duration-200"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="text-center md:text-right">
        <p>{copyrightText}</p>
        <div className="flex gap-4 mt-2 justify-center md:justify-end">
          {socialLinks.map((link, idx) => (
            <span
              key={idx}
              onClick={link.onClick}
              className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary"
            >
              {link.icon}
            </span>
          ))}
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
