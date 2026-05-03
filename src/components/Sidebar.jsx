import {
  FaEnvelope, FaFacebookF, FaGithub, FaPhone, FaMapMarkerAlt
} from 'react-icons/fa';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import briolImage from '../assets/briol.JPG';

const contactItems = [
  { icon: FaEnvelope, label: 'briolchristian040@gmail.com', href: 'mailto:cjbriol@gmail.com', id: 'contact-email' },
  { icon: FaFacebookF, label: 'facebook.com/jirehkun.briol.1', href: 'https://www.facebook.com/jirehkun.briol.1', id: 'contact-facebook' },
  { icon: FaGithub, label: 'github.com/Ji-chan01', href: 'https://github.com/Ji-chan01', id: 'contact-github' },
  { icon: FaPhone, label: '+63 950 657 0618', href: 'tel:+639000000000', id: 'contact-phone' },
  { icon: FaMapMarkerAlt, label: 'Masbate City, PH', href: null, id: 'contact-location' },
];

export default function Sidebar({ dark, onToggle, isMobileAccordion = false }) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <aside className={`flex flex-col bg-accent dark:bg-zinc-900 ${isMobileAccordion ? 'w-full pb-4' : 'h-full justify-center border-r border-white/10 dark:border-zinc-700 overflow-y-auto'}`}>
      {/* Profile Section */}
      {!isMobileAccordion && (
        <div className="flex flex-col items-center px-6 pt-8 pb-6">
          {/* Avatar */}
          <div className="relative mb-4">
            <div
              onClick={() => setIsZoomed(true)}
              className="w-28 h-28 rounded-full bg-zinc-100 dark:bg-zinc-800 glow-accent overflow-hidden ring-4 ring-white/20 dark:ring-accent dark:ring-opacity-30 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <img src={briolImage} alt="Christian Jireh" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Name */}
          <h1 className="text-lg font-extrabold text-white dark:text-zinc-100 text-center leading-tight">
            Christian Jireh A. Briol
          </h1>

          {/* Title Badges */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-2.5">
            <span className="badge bg-white/20 dark:bg-red-900/40 text-white dark:text-red-400 text-[10px]">
              UI/UX Designer
            </span>
            <span className="badge bg-white/10 dark:bg-zinc-700 text-white dark:text-zinc-300 text-[10px]">
              Full-Stack Dev
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      {!isMobileAccordion && (
        <div className="mx-6 border-t border-white/10 dark:border-zinc-700" />
      )}

      {/* Contact Info */}
      <div className="px-6 py-4">
        <div className="mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 dark:text-zinc-500">
            Contacts
          </span>
        </div>

        <ul className="space-y-3">
          {contactItems.map(({ icon: Icon, label, href, id }) => (
            <li key={id}>
              {href ? (
                <a id={id} href={href} target="_blank" rel="noreferrer" className="sidebar-link">
                  <span className="w-7 h-7 rounded-lg bg-white/10 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Icon size={12} className="text-white" />
                  </span>
                  <span className="text-xs truncate">{label}</span>
                </a>
              ) : (
                <span id={id} className="sidebar-link cursor-default">
                  <span className="w-7 h-7 rounded-lg bg-white/10 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Icon size={12} className="text-white" />
                  </span>
                  <span className="text-xs truncate">{label}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-white/10 dark:border-zinc-700" />

      {/* Social Icons */}
      <div className="px-6 py-4 flex items-center gap-2 justify-center">
        <a
          id="social-email"
          href="mailto:briolchristian040@gmail.com"
          className="w-9 h-9 rounded-xl bg-white/10 dark:bg-zinc-800 flex items-center justify-center text-white dark:text-zinc-400 hover:bg-white/20 transition-all duration-200"
          aria-label="Email"
        >
          <FaEnvelope size={14} />
        </a>
        <a
          id="social-facebook"
          href="https://www.facebook.com/jirehkun.briol.1"
          target="_blank" rel="noreferrer"
          className="w-9 h-9 rounded-xl bg-white/10 dark:bg-zinc-800 flex items-center justify-center text-white dark:text-zinc-400 hover:bg-white/20 transition-all duration-200"
          aria-label="Facebook"
        >
          <FaFacebookF size={14} />
        </a>
        <a
          id="social-github"
          href="https://github.com/Ji-chan01"
          target="_blank" rel="noreferrer"
          className="w-9 h-9 rounded-xl bg-white/10 dark:bg-zinc-800 flex items-center justify-center text-white dark:text-zinc-400 hover:bg-white/20 transition-all duration-200"
          aria-label="GitHub"
        >
          <FaGithub size={14} />
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
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
                src={briolImage}
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
