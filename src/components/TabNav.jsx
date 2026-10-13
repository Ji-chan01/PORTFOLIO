import { motion } from 'framer-motion';
import { FaFacebookF, FaGithub, FaEnvelope } from 'react-icons/fa';

const tabs = ['About', 'Resume', 'Portfolio'];

const socialLinks = [
  {
    name: 'Facebook',
    icon: FaFacebookF,
    href: 'https://www.facebook.com/jichannn',
    id: 'nav-social-fb'
  },
  {
    name: 'GitHub',
    icon: FaGithub,
    href: 'https://github.com/Ji-chan01',
    id: 'nav-social-github'
  },
  {
    name: 'Gmail',
    icon: FaEnvelope,
    href: typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      ? 'mailto:briolchristian040@gmail.com'
      : 'https://mail.google.com/mail/?view=cm&fs=1&to=briolchristian040@gmail.com',
    id: 'nav-social-email'
  }
];

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <nav className="border-t lg:border-t-0 bg-white/70 dark:bg-black/70 backdrop-blur-md border-zinc-200/50 dark:border-white/10 z-10 px-20 md:px-24 py-2">
      <div className="flex items-center justify-between h-16 w-full">
        {/* Left: Picture and Name (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 min-w-[240px]">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-2 ring-accent/30 flex-shrink-0">
            <img
              src="https://res.cloudinary.com/dlqxpz9pu/image/upload/v1791361795/8a7d83c8-6bdf-4065-a50e-9dd5bb86786d_jfmfog.jpg"
              alt="Christian Jireh Briol"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* <span className="text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight whitespace-nowrap">
              CHRISTIAN JIREH BRIOL
            </span> */}
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
                  className="absolute top-0 lg:top-auto lg:bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
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
