import { motion } from 'framer-motion';

export default function ProjectCard({ project, onOpen, index }) {
  const { name, role, type, tech, color, emoji, shortDesc } = project;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex flex-col h-full rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
    >
      {/* Thumbnail - Truly Transparent */}
      <div className="relative h-44 bg-transparent flex items-center justify-center overflow-hidden flex-shrink-0">
        {project.image ? (
          <img src={project.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-7xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </span>
        )}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-300" />
      </div>

      {/* Body - Expands to fill height */}
      <div className="p-5 bg-white dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 mb-2">{name}</h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge bg-accent/10 text-accent-dark dark:text-accent">{role}</span>
          <span className="badge bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300">{type}</span>
          <span className="badge bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300">{tech}</span>
        </div>

        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">{shortDesc}</p>
      </div>
    </motion.div>
  );
}
