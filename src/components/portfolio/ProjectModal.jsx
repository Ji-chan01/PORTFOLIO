import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!project) return null;
  const { name, role, type, tech, color, emoji, longDesc, features } = project;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`relative h-40 bg-gradient-to-br ${color} flex items-center justify-center`}>
            <span className="text-7xl filter drop-shadow-lg">{emoji}</span>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Close modal"
            >
              <FaTimes size={14} />
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">{name}</h2>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="badge bg-accent/10 text-accent-dark dark:text-accent">{role}</span>
              <span className="badge bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300">{type}</span>
              <span className="badge bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300">{tech}</span>
            </div>

            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-5">{longDesc}</p>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Key Features</h3>
              <ul className="space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
                    <FaCheckCircle className="text-accent mt-0.5 flex-shrink-0" size={13} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
