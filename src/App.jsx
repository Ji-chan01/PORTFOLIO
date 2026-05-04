import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TabNav from './components/TabNav';
import AboutTab from './tabs/AboutTab';
import ResumeTab from './tabs/ResumeTab';
import PortfolioTab from './tabs/PortfolioTab';
import ContactTab from './tabs/ContactTab';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaSun, FaMoon } from 'react-icons/fa';

function getInitialTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function App() {
  const [dark, setDark] = useState(getInitialTheme);
  const [activeTab, setActiveTab] = useState('About');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Apply dark class + persist preference
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Scroll to top when tab changes
  useEffect(() => {
    const desktopScroll = document.getElementById('scroll-container-desktop');
    const mobileScroll = document.getElementById('scroll-container-mobile');
    if (desktopScroll) desktopScroll.scrollTop = 0;
    if (mobileScroll) mobileScroll.scrollTop = 0;
  }, [activeTab]);

  const toggleTheme = () => setDark((v) => !v);

  const renderTab = () => {
    switch (activeTab) {
      case 'About': return <AboutTab key="About" onTabChange={setActiveTab} />;
      case 'Resume': return <ResumeTab key="Resume" />;
      case 'Portfolio': return <PortfolioTab key="Portfolio" />;
      case 'Contact': return <ContactTab key="Contact" />;
      default: return <AboutTab key="About" onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-zinc-900 transition-colors duration-300">

      {/* ──────────────── DESKTOP LAYOUT (lg+) ──────────────── */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="w-[300px] flex-shrink-0 h-full">
          <Sidebar dark={dark} onToggle={toggleTheme} />
        </div>

        {/* Right Panel */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} dark={dark} onToggle={toggleTheme} />
          <div id="scroll-container-desktop" className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {renderTab()}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ──────────────── MOBILE LAYOUT (<lg) ──────────────── */}
      <div className="lg:hidden flex flex-col h-[100dvh] overflow-hidden">
        {/* Mobile Top Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setIsZoomed(true)}
              className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform"
            >
              <img src="https://res.cloudinary.com/dlqxpz9pu/image/upload/f_auto,q_auto/briol_yj9lus" loading="lazy" alt="Christian Jireh" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm md:text-base font-bold text-gray-900 dark:text-zinc-100 leading-tight">Christian Jireh A. Briol</p>
              <p className="text-[10px] md:text-xs text-accent font-semibold">UI/UX Designer · Full-Stack Dev</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-300"
              aria-label="Toggle theme"
            >
              {dark ? <FaSun size={14} className="text-accent" /> : <FaMoon size={14} />}
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setSidebarOpen((v) => !v)}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-300"
              aria-label="Toggle contact info"
            >
              {sidebarOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Accordion */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 flex-shrink-0 z-10"
            >
              <Sidebar dark={dark} onToggle={toggleTheme} isMobileAccordion={true} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <main id="scroll-container-mobile" className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderTab()}
          </AnimatePresence>
        </main>

        {/* Tab Nav (Bottom) */}
        <div className="flex-shrink-0 relative z-20">
          <TabNav activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setSidebarOpen(false); }} dark={dark} onToggle={toggleTheme} />
        </div>
      </div>

      {/* Zoom Modal (Mobile) */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="https://res.cloudinary.com/dlqxpz9pu/image/upload/f_auto,q_auto/briol_yj9lus"
                alt="Christian Jireh Zoomed"
                className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl object-contain border-2 border-white/20"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl active:scale-110 transition-transform cursor-pointer border border-white/20"
              >
                <span className="text-2xl font-light">&times;</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
