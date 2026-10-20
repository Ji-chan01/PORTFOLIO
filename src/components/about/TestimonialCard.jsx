import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

export default function TestimonialCard({
  testimonial,
  index,
  onClick,
  isTopRight = false,
  isBottomLeft = false,
  isMobileTopRight = false,
  isMobileBottomLeft = false
}) {
  const { name, role, rating, text } = testimonial;

  const showHeartEyes = isTopRight || isMobileTopRight;
  const showWow = isBottomLeft || isMobileBottomLeft;

  // Responsive display classes:
  // If only active on desktop: hidden sm:block
  // If only active on mobile: block sm:hidden
  // If active on both: block
  const heartEyesVisibility = isTopRight && isMobileTopRight
    ? 'block'
    : isTopRight
    ? 'hidden sm:block'
    : 'block sm:hidden';

  const wowVisibility = isBottomLeft && isMobileBottomLeft
    ? 'block'
    : isBottomLeft
    ? 'hidden sm:block'
    : 'block sm:hidden';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(testimonial)}
      className="relative rounded-2xl bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/60 shadow-sm p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md hover:border-accent/40 dark:hover:border-accent/50 dark:hover:bg-zinc-800/80 transition-all duration-300 h-[260px]"
    >
      {/* Dynamic Smiling face with heart-eyes on top-right card */}
      {showHeartEyes && (
        <img
          src="/Heart%20eyes.svg"
          alt="Smiling face with heart eyes"
          className={`absolute -top-6 -right-6 w-14 h-14 sm:w-16 sm:h-16 select-none filter drop-shadow-xl pointer-events-none z-20 transform hover:scale-110 transition-transform rotate-12 ${heartEyesVisibility}`}
          loading="lazy"
        />
      )}

      {/* Dynamic Wow emoji on bottom-left card */}
      {showWow && (
        <img
          src="/Emoji%20Wow.svg"
          alt="Wow emoji"
          className={`absolute -bottom-6 -left-6 w-14 h-14 sm:w-16 sm:h-16 select-none filter drop-shadow-xl pointer-events-none z-20 transform hover:scale-110 transition-transform -rotate-12 ${wowVisibility}`}
          loading="lazy"
        />
      )}

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
