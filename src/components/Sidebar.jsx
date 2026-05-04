import {
  FaEnvelope, FaFacebookF, FaGithub, FaPhone, FaMapMarkerAlt
} from 'react-icons/fa';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const contactItems = [
  { icon: FaEnvelope, label: 'briolchristian040@gmail.com', href: 'mailto:cjbriol@gmail.com', id: 'contact-email' },
  { icon: FaFacebookF, label: 'facebook.com/jirehkun.briol.1', href: 'https://www.facebook.com/jirehkun.briol.1', id: 'contact-facebook' },
  { icon: FaGithub, label: 'github.com/Ji-chan01', href: 'https://github.com/Ji-chan01', id: 'contact-github' },
  { icon: FaMapMarkerAlt, label: 'Masbate City, PH', href: null, id: 'contact-location' },
];

export default function Sidebar({ dark, onToggle, isMobileAccordion = false }) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Conditional styles based on context
  const textColor = isMobileAccordion ? 'text-gray-900' : 'text-white';
  const subTextColor = isMobileAccordion ? 'text-gray-400' : 'text-white';
  const iconBg = isMobileAccordion ? 'bg-blue-50' : 'bg-white/10';
  const iconColor = isMobileAccordion ? 'text-accent' : 'text-white';
  const dividerColor = isMobileAccordion ? 'border-gray-100' : 'border-white/10';
  const socialBg = isMobileAccordion ? 'bg-gray-100' : 'bg-white/10';
  const socialText = isMobileAccordion ? 'text-gray-500' : 'text-white';
  const socialHover = isMobileAccordion ? 'hover:bg-accent hover:text-white' : 'hover:bg-white/20';

  return (
    <aside className={`flex flex-col ${isMobileAccordion ? 'bg-white dark:bg-zinc-900' : 'bg-accent dark:bg-zinc-900'} ${isMobileAccordion ? 'w-full pb-4' : 'h-full justify-center border-r border-white/10 dark:border-zinc-700 overflow-y-auto'}`}>
      {/* Profile Section */}
      {!isMobileAccordion && (
        <div className="flex flex-col items-center px-6 pt-8 pb-6">
          {/* Avatar */}
          <div className="relative mb-4">
            <div
              onClick={() => setIsZoomed(true)}
              className="w-28 h-28 rounded-full bg-zinc-100 dark:bg-zinc-800 glow-accent overflow-hidden ring-4 ring-white/20 dark:ring-accent dark:ring-opacity-30 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <img src="https://res.cloudinary.com/dlqxpz9pu/image/upload/f_auto,q_auto/briol_yj9lus" loading="lazy" alt="Christian Jireh" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Name */}
          <h1 className={`text-lg font-extrabold ${textColor} dark:text-zinc-100 text-center leading-tight`}>
            Christian Jireh A. Briol
          </h1>

          {/* Title Badges */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-2.5">
            <span className={`badge ${isMobileAccordion ? 'bg-blue-100 text-blue-700' : 'bg-white/20 text-white'} dark:bg-red-900/40 dark:text-red-400 text-[10px] md:text-xs`}>
              UI/UX Designer
            </span>
            <span className={`badge ${isMobileAccordion ? 'bg-zinc-100 text-zinc-600' : 'bg-white/10 text-white'} dark:bg-zinc-700 dark:text-zinc-300 text-[10px] md:text-xs`}>
              Full-Stack Dev
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      {!isMobileAccordion && (
        <div className={`mx-6 border-t ${dividerColor} dark:border-zinc-700`} />
      )}

      {/* Contact Info */}
      <div className="px-6 py-4">
        <div className="mb-3">
          <span className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] ${subTextColor} dark:text-zinc-500`}>
            Contacts
          </span>
        </div>

        <ul className="space-y-3">
          {contactItems.map(({ icon: Icon, label, href, id }) => (
            <li key={id}>
              {href ? (
                <a id={id} href={href} target="_blank" rel="noreferrer" className={`sidebar-link ${isMobileAccordion ? '!text-gray-500 hover:!text-accent' : ''}`}>
                  <span className={`w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl ${iconBg} dark:bg-zinc-800 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`${iconColor} text-[12px] md:text-[16px]`} />
                  </span>
                  <span className="text-xs md:text-sm truncate">{label}</span>
                </a>
              ) : (
                <span id={id} className={`sidebar-link cursor-default ${isMobileAccordion ? '!text-gray-500' : ''}`}>
                  <span className={`w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl ${iconBg} dark:bg-zinc-800 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`${iconColor} text-[12px] md:text-[16px]`} />
                  </span>
                  <span className="text-xs md:text-sm truncate">{label}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div className={`mx-6 border-t ${dividerColor} dark:border-zinc-700`} />

      {/* Social Icons */}
      <div className="px-6 py-4 flex items-center gap-2 justify-center">
        <a
          id="social-email"
          href="mailto:briolchristian040@gmail.com"
          className={`w-9 h-9 md:w-11 md:h-11 rounded-xl ${socialBg} dark:bg-zinc-800 flex items-center justify-center ${socialText} dark:text-zinc-400 ${socialHover} transition-all duration-200`}
          aria-label="Email"
        >
          <FaEnvelope className="text-[14px] md:text-[18px]" />
        </a>
        <a
          id="social-facebook"
          href="https://www.facebook.com/jirehkun.briol.1"
          target="_blank" rel="noreferrer"
          className={`w-9 h-9 md:w-11 md:h-11 rounded-xl ${socialBg} dark:bg-zinc-800 flex items-center justify-center ${socialText} dark:text-zinc-400 ${socialHover} transition-all duration-200`}
          aria-label="Facebook"
        >
          <FaFacebookF className="text-[14px] md:text-[18px]" />
        </a>
        <a
          id="social-github"
          href="https://github.com/Ji-chan01"
          target="_blank" rel="noreferrer"
          className={`w-9 h-9 md:w-11 md:h-11 rounded-xl ${socialBg} dark:bg-zinc-800 flex items-center justify-center ${socialText} dark:text-zinc-400 ${socialHover} transition-all duration-200`}
          aria-label="GitHub"
        >
          <FaGithub className="text-[14px] md:text-[18px]" />
        </a>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-3xl w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="https://res.cloudinary.com/dlqxpz9pu/image/upload/f_auto,q_auto/briol_yj9lus"
                alt="Christian Jireh Zoomed"
                className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl object-contain border-4 border-white/20"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform cursor-pointer border border-white/20"
              >
                <span className="text-2xl font-light">&times;</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </aside>
  );
}
