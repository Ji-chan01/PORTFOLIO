import { motion } from 'framer-motion';
import { optimizeImage } from '../../lib/cloudinary';

export default function ProjectCard({ project, index }) {
  const { name, role, type, tech, color, emoji, shortDesc, image } = project;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="masonry-item rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group bg-white dark:bg-zinc-800"
    >
      {/* Image or emoji banner — height adapts naturally */}
      {image ? (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <img
            src={optimizeImage(image, 600)}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-300" />
        </div>
      ) : (
        <div className={`w-full h-28 bg-gradient-to-br ${color} flex items-center justify-center`}>
          <span className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </span>
        </div>
      )}

      {/* Content — no fixed height, grows with description */}
      <div className="p-4 border-t border-gray-100 dark:border-zinc-700">
        <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-2 leading-snug">{name}</h3>

        <div className="flex flex-wrap gap-1 mb-2.5">
          <span className="badge bg-accent/10 text-accent-dark dark:text-accent text-[10px]">{role}</span>
          <span className="badge bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 text-[10px]">{type}</span>
          <span className="badge bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 text-[10px]">{tech}</span>
        </div>

        <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">{shortDesc}</p>
      </div>
    </motion.div>
  );
}
