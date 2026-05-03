import { motion } from 'framer-motion';

export default function ProjectCard({ project, onOpen, index }) {
  const { name, role, type, tech, color, emoji, shortDesc } = project;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="card overflow-hidden group cursor-pointer"
      onClick={() => onOpen(project)}
    >
      {/* Thumbnail */}
      <div className={`relative h-44 bg-gradient-to-br ${color} flex items-center justify-center overflow-hidden`}>
        <span className="text-7xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </span>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300" />
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 mb-2">{name}</h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge bg-accent/10 text-accent-dark dark:text-accent">{role}</span>
          <span className="badge bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300">{type}</span>
          <span className="badge bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300">{tech}</span>
        </div>

        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed mb-4">{shortDesc}</p>

        <button
          className="text-xs font-semibold text-accent hover:text-accent-dark flex items-center gap-1 group/btn transition-colors duration-200"
          onClick={(e) => { e.stopPropagation(); onOpen(project); }}
        >
          View Details
          <span className="group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
        </button>
      </div>
    </motion.div>
  );
}
