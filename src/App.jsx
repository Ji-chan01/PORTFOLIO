import { useState, useEffect } from 'react';
import TabNav from './components/TabNav';
import Sidebar from './components/Sidebar';
import AboutTab from './tabs/AboutTab';
import ResumeTab from './tabs/ResumeTab';
import PortfolioTab from './tabs/PortfolioTab';
import ContactTab from './tabs/ContactTab';
import { AnimatePresence, motion } from 'framer-motion';
import { FaSun, FaMoon, FaChevronDown, FaChevronUp } from 'react-icons/fa';

function getInitialTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) return saved === 'dark';
  return false; // Default to light mode
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
      case 'About': return <AboutTab key="About" onTabChange={setActiveTab} dark={dark} onToggle={toggleTheme} />;
      case 'Resume': return <ResumeTab key="Resume" />;
      case 'Portfolio': return <PortfolioTab key="Portfolio" />;
      case 'Contact': return <AboutTab key="About" onTabChange={setActiveTab} dark={dark} onToggle={toggleTheme} />;
      default: return <AboutTab key="About" onTabChange={setActiveTab} dark={dark} onToggle={toggleTheme} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-black transition-colors duration-300">


      {/* Desktop view */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} onProfileClick={() => setIsZoomed(true)} />
          <div id="scroll-container-desktop" className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {renderTab()}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden fixed inset-0 flex flex-col overflow-hidden overscroll-none">
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setIsZoomed(true)}
              className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform ring-2 ring-accent/30"
            >
              <img src="https://res.cloudinary.com/dlqxpz9pu/image/upload/v1791361795/8a7d83c8-6bdf-4065-a50e-9dd5bb86786d_jfmfog.jpg" loading="lazy" alt="Christian Jireh Briol" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm md:text-base font-bold text-gray-900 dark:text-zinc-100 leading-tight">Christian Jireh Briol</p>
              <p className="text-[10px] md:text-xs text-accent font-semibold">UI/UX Designer · Full-Stack Dev</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-300 active:scale-95 transition-transform"
              aria-label="Toggle theme"
            >
              {dark ? <FaSun size={14} className="text-accent" /> : <FaMoon size={14} />}
            </button>
            <button
              id="mobile-contacts-accordion-btn"
              onClick={() => setSidebarOpen((v) => !v)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                sidebarOpen
                  ? 'bg-accent text-white shadow-sm ring-2 ring-accent/30'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:text-accent'
              }`}
              aria-label="Toggle contacts"
              title="Contacts"
            >
              {sidebarOpen ? <FaChevronUp size={13} /> : <FaChevronDown size={13} />}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0 z-20 shadow-lg"
            >
              <Sidebar dark={dark} onToggle={toggleTheme} isMobileAccordion={true} />
            </motion.div>
          )}
        </AnimatePresence>

        <main id="scroll-container-mobile" className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {renderTab()}
          </AnimatePresence>
        </main>

        <div className="flex-shrink-0 relative z-20">
          <TabNav activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setSidebarOpen(false); }} onProfileClick={() => setIsZoomed(true)} />
        </div>
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95"
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform cursor-pointer border border-white/20 z-50"
              aria-label="Close modal"
            >
              <span className="text-3xl font-light">&times;</span>
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="https://res.cloudinary.com/dlqxpz9pu/image/upload/v1791361795/8a7d83c8-6bdf-4065-a50e-9dd5bb86786d_jfmfog.jpg"
                alt="Christian Jireh Zoomed"
                className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl object-contain border-2 border-white/20"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
