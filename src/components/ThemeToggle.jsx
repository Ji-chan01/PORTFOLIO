import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ThemeToggle({ dark, onToggle }) {
  return (
    <motion.button
      id="theme-toggle"
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors duration-200 text-gray-600 dark:text-zinc-300 text-sm font-medium w-full justify-center"
      aria-label="Toggle theme"
    >
      <motion.div
        key={dark ? 'moon' : 'sun'}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {dark ? <FaSun className="text-white" /> : <FaMoon />}
      </motion.div>
    </motion.button>
  );
}
