import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

export default function TestimonialCard({ testimonial, index, onClick }) {
  const { name, role, rating, text } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(testimonial)}
      className="rounded-2xl bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/60 shadow-sm p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md hover:border-accent/40 dark:hover:border-accent/50 dark:hover:bg-zinc-800/80 transition-all duration-300 h-[260px]"
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: Math.floor(rating) }).map((_, i) => (
          <FaStar key={i} className="text-accent text-sm" />
        ))}
        {rating % 1 !== 0 && (
          <FaStarHalfAlt className="text-accent text-sm" />
        )}
      </div>

      {/* Quote */}
      <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed line-clamp-4">
        "{text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-zinc-700/50 mt-auto">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/60 to-accent/20 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">{name.charAt(0)}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{name}</p>
          <p className="text-xs text-gray-500 dark:text-zinc-400">@{name.toLowerCase().replace(/\s+/g, '')}</p>
        </div>
      </div>
    </motion.div>
  );
}
