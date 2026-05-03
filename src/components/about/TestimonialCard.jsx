import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

export default function TestimonialCard({ testimonial, index, onClick }) {
  const { name, role, initials, color, rating, text } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => onClick(testimonial)}
      className="card p-6 flex flex-col gap-4 h-[260px] cursor-pointer hover:border-accent dark:hover:border-accent transition-colors duration-200"
    >
      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <FaStar key={i} className="text-accent text-sm" />
        ))}
      </div>

      {/* Quote */}
      <div className="flex-1 overflow-hidden">
        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed italic line-clamp-5">
          "{text}"
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-zinc-700">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{name}</p>
          <p className="text-xs text-gray-500 dark:text-zinc-400">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
