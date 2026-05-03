import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const tabs = ['About', 'Resume', 'Portfolio', 'Contact'];

export default function TabNav({ activeTab, onTabChange, dark, onToggle }) {
  return (
    <nav className="flex items-center justify-between border-t md:border-t-0 md:border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 z-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center w-full md:w-auto justify-between md:justify-start flex-nowrap whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            id={`tab-${tab.toLowerCase()}`}
            onClick={() => onTabChange(tab)}
            className={`tab-btn py-5 md:flex-shrink-0 flex items-center justify-center ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.span
                layoutId="tab-underline"
                className="absolute top-0 md:top-auto md:bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="px-2 flex-shrink-0 hidden md:block">
        <ThemeToggle dark={dark} onToggle={onToggle} />
      </div>
    </nav>
  );
}
