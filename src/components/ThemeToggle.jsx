import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ThemeToggle({ dark, onToggle }) {
  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
      aria-label="Toggle dark and light mode"
      className="inline-flex items-center p-1 rounded-full bg-gray-200/80 dark:bg-zinc-800/90 border border-gray-300 dark:border-zinc-700 cursor-pointer select-none transition-colors duration-200 shadow-inner"
    >
      {/* Light Option */}
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
          !dark
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
        }`}
      >
        <FaSun size={12} className={!dark ? 'text-amber-500' : ''} />
        <span>Light</span>
      </div>

      {/* Dark Option */}
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
          dark
            ? 'bg-zinc-900 text-white shadow-sm ring-1 ring-accent/40'
            : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
        }`}
      >
        <FaMoon size={11} className={dark ? 'text-accent' : ''} />
        <span>Dark</span>
      </div>
    </div>
  );
}
