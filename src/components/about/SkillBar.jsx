import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function SkillBar({ name, level, delay = 0, color = 'bg-accent' }) {
  const barRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && barRef.current) {
          setTimeout(() => {
            if (barRef.current) {
              barRef.current.style.width = `${level}%`;
            }
          }, delay);
        }
      },
      { threshold: 0.3 }
    );
    if (barRef.current) observer.observe(barRef.current.parentElement);
    return () => observer.disconnect();
  }, [level, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className="mb-4"
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{name}</span>
        <span className="text-xs font-bold text-accent">{level}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: '0%' }}
        />
      </div>
    </motion.div>
  );
}
