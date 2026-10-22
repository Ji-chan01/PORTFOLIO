import { motion } from 'framer-motion';
import { FaFacebookF, FaGithub, FaEnvelope } from 'react-icons/fa';
import { PROFILE_IMAGE_URL, FACEBOOK_URL, GITHUB_URL } from '../lib/constants';
import { getEmailHref } from '../lib/contact';
import { optimizeImage } from '../lib/cloudinary';

const tabs = ['About', 'Portfolio'];

const socialLinks = [
  {
    name: 'Facebook',
    icon: FaFacebookF,
    href: FACEBOOK_URL,
    id: 'nav-social-fb'
  },
  {
    name: 'GitHub',
    icon: FaGithub,
    href: GITHUB_URL,
    id: 'nav-social-github'
  },
  {
    name: 'Gmail',
    icon: FaEnvelope,
    href: getEmailHref(),
    id: 'nav-social-email'
  }
];

export default function TabNav({ activeTab, onTabChange, onProfileClick }) {
  return (
    <nav className="border-t-0 bg-white/70 dark:bg-black/70 backdrop-blur-md z-10 px-6 md:px-24 py-0">
      <div className="flex items-center justify-between h-16 w-full">
        {/* Left: Picture and Name (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 min-w-[240px]">
          <div
            onClick={onProfileClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onProfileClick();
              }
            }}
            className="w-9 h-9 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-2 ring-accent/30 flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            role="button"
            tabIndex={0}
            title="View photo"
            aria-label="View photo"
          >
            <img
              src={optimizeImage(PROFILE_IMAGE_URL, 128)}
              alt="Christian Jireh Briol"
              className="w-full h-full object-cover"
              decoding="async"
            />
          </div>
        </div>

        {/* Center: Tabs */}
        <div className="flex items-center justify-center flex-1 lg:flex-initial mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              onClick={() => onTabChange(tab)}
              className={`tab-btn py-5 relative flex items-center justify-center font-semibold text-xs sm:text-sm px-3 sm:px-5 transition-colors ${activeTab === tab ? 'active text-accent' : 'text-gray-500 dark:text-zinc-400 hover:text-accent'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right: Social contact links (Desktop) */}
        <div className="hidden lg:flex items-center justify-end gap-2.5 min-w-[240px]">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              id={item.id}
              href={item.href}
              target={item.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              title={item.name}
              aria-label={item.name}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-black transition-all duration-200 active:scale-95"
            >
              <item.icon size={14} />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
