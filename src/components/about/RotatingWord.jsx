import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Words that swap in for "innovation" in: "Where ____, meets the podium."
export const HERO_WORDS = [
  'innovation',
  'creativity',
  'design',
  'craft',
  'vision',
  'ideas',
  'code',
  'ambition',
];

export default function RotatingWord({
  words = HERO_WORDS,
  interval = 2000, // ms between swaps
  className = '',
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return undefined; // reduced motion: keep the first word, no cycling
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [reduce, interval, words.length]);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Screen readers get a stable label instead of a flickering word */}
      <span className="sr-only">{words[0]}</span>
      <span aria-hidden="true" className="inline-block">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={words[index]}
            className="inline-block"
            initial={{ opacity: 0, y: '0.4em', filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: '-0.4em', filter: 'blur(6px)' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
