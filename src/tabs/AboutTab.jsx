import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import CursorLamp from '../components/desk/CursorLamp';
import SkillBar from '../components/about/SkillBar';
import TechMarquee from '../components/about/TechMarquee';
import TestimonialCard from '../components/about/TestimonialCard';
import StarsBackground from '../components/about/StarsBackground';
import ContactSection from '../components/about/ContactSection';
import {
  frontendSkills, mobileSkills, backendSkills, designSkills
} from '../data/skills';
import { testimonials } from '../data/testimonials';
import { projects } from '../data/projects';
import {
  FaCode, FaHeart, FaChess, FaBasketballBall, FaMusic, FaTimes, FaStar, FaStarHalfAlt,
  FaDownload, FaArrowRight, FaLock, FaEye, FaEyeSlash
} from 'react-icons/fa';

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

// Two-layer animated wave. flip = black fills BELOW the curve (for the top edge of a black section).
function WaveEdge({ flip = false, className = '', style }) {
  const reduceMotion = useReducedMotion();
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className={`block ${className}`}
      style={{ ...style, transform: flip ? 'scaleY(-1)' : undefined }}
    >
      {/* Back layer: lighter, slower */}
      <motion.path
        fill={DESK_COLOR}
        fillOpacity={0.35}
        initial={{ d: BACK_A }}
        animate={reduceMotion ? { d: BACK_A } : { d: [BACK_A, BACK_B] }}
        transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
      />
      {/* Front layer: solid black, continues the section */}
      <motion.path
        fill={DESK_COLOR}
        initial={{ d: FRONT_A }}
        animate={reduceMotion ? { d: FRONT_A } : { d: [FRONT_A, FRONT_B] }}
        transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
      />
    </svg>
  );
}

function SkillGroup({ title, skills, barColor, delay = 0 }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-3">
        {title}
      </h4>
      {skills.map((s, i) => (
        <SkillBar
          key={s.name}
          name={s.name}
          level={s.level}
          color={barColor}
          delay={delay + i * 120}
        />
      ))}
    </div>
  );
}

const RESUME_PASSWORD = '909-251';
const RESUME_URL = 'https://res.cloudinary.com/dlqxpz9pu/image/upload/fl_attachment/v1784533003/Briol_Christian_Jireh_RESUME_2026_ulj5ze.pdf';

// Same as the dark-mode page background (pure black). Keep in sync with DESK_COLOR in CursorLamp.jsx
const DESK_COLOR = '#000000';

// Big animated wave: shapes share one structure so they can morph into each other.
// makeWave(base line, control 1, control 2) -> swap the controls to flip crest/trough.
const makeWave = (base, c1, c2) =>
  `M0,0 H1440 V${base} C1200,${c1} 960,${c2} 720,${base} C480,${c1} 240,${c2} 0,${base} Z`;
const FRONT_A = makeWave(100, 240, -40);
const FRONT_B = makeWave(100, -40, 240);
const BACK_A = makeWave(120, -40, 240);
const BACK_B = makeWave(120, 240, -40);

export default function AboutTab({ onTabChange, dark, onToggle }) {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState('talk');
  const passwordInputRef = useRef(null);
  const talkBtnRef = useRef(null);
  const resumeBtnRef = useRef(null);
  const [slider, setSlider] = useState({ left: 0, width: 0 });
  const [lampOff, setLampOff] = useState(false); // true while the stats cards are on screen

  const scrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    const updateSlider = () => {
      const target = hoveredBtn === 'resume' ? resumeBtnRef.current : talkBtnRef.current;
      if (target) {
        setSlider({ left: target.offsetLeft, width: target.offsetWidth });
      }
    };
    updateSlider();
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [hoveredBtn]);

  const openPasswordModal = () => {
    setPasswordInput('');
    setPasswordError(false);
    setShowPassword(false);
    setShowPasswordModal(true);
    setTimeout(() => passwordInputRef.current?.focus(), 100);
  };

  const handleDownload = () => {
    if (passwordInput === RESUME_PASSWORD) {
      const a = document.createElement('a');
      a.href = RESUME_URL;
      a.download = 'Christian Jireh A. Briol_RESUME.pdf';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setShowPasswordModal(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
      passwordInputRef.current?.focus();
    }
  };

  // ---- Black "desk" slab: from the lamp's ground line to the bottom of Technologies ----
  const rootRef = useRef(null);
  const slabRef = useRef(null);
  const statsRef = useRef(null);
  const techRef = useRef(null);
  const topRef = useRef(null);    // slab top, in root-relative px (desktop: driven by the lamp)
  const bottomRef = useRef(0);    // slab bottom, in root-relative px

  // Switch the lamp off (no cursor following, no light) as soon as the stats cards come into view.
  // rootMargin: the cards count as "in view" once their top enters the upper 65% of the screen.
  useEffect(() => {
    const el = statsRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => setLampOff(entry.isIntersecting), {
      rootMargin: '0px 0px -35% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const applySlab = () => {
    const el = slabRef.current;
    if (!el || topRef.current == null) return;
    el.style.top = topRef.current + 'px';
    el.style.height = Math.max(0, bottomRef.current - topRef.current) + 'px';
    el.style.display = 'block';
  };

  // Called every frame by the lamp with the screen-y of its ground line
  const handleGround = (viewportY) => {
    if (window.innerWidth < 1024 || !rootRef.current) return;
    const top = viewportY - rootRef.current.getBoundingClientRect().top - 1; // 1px overlap hides any hairline seam
    if (topRef.current == null || Math.abs(top - topRef.current) > 0.4) {
      topRef.current = top;
      applySlab();
    }
  };

  useLayoutEffect(() => {
    const PAD_BOTTOM = 32; // breathing room under the last skill bar
    const measure = () => {
      const root = rootRef.current, stats = statsRef.current, tech = techRef.current;
      if (!root || !stats || !tech) return;
      const r = root.getBoundingClientRect();
      bottomRef.current = tech.getBoundingClientRect().bottom - r.top + PAD_BOTTOM;
      // Mobile (lamp stacked above the text): start at the stats row instead of the lamp
      if (window.innerWidth < 1024) topRef.current = stats.getBoundingClientRect().top - r.top - 24;
      applySlab();
    };
    measure();
    const ro = new ResizeObserver(measure);
    [rootRef, statsRef, techRef].forEach((x) => x.current && ro.observe(x.current));
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // Inside the black slab we force the dark theme; keep the light-mode blue accent there.
  const slabVars = dark ? undefined : {
    '--color-accent': '8 102 255',
    '--color-accent-dark': '0 85 255',
    '--color-gradient-start': '#0866FF',
    '--color-gradient-end': '#00d4ff',
    '--color-glow': 'rgba(8, 102, 255, 0.2)',
  };

  return (
    <motion.div
      ref={rootRef}
      key="about"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="relative isolate px-6 md:px-8 pt-3 md:pt-4 space-y-24 md:space-y-32"
    >
      {/* Solid, fully opaque desk surface (top edge set from the lamp's ground line) */}
      <div
        ref={slabRef}
        aria-hidden="true"
        className="absolute left-0 right-0 -z-10 pointer-events-none"
        style={{ display: 'none', top: 0, height: 0, background: DESK_COLOR }}
      >
        {/* Big wavy bottom edge: hangs below the slab and ripples into "What Clients Say" */}
        <WaveEdge className="absolute left-0 w-full h-28 md:h-44" style={{ top: 'calc(100% - 1px)' }} />
      </div>

      <section className="flex flex-col justify-start pt-1 pb-6">
        <div className="flex flex-col-reverse lg:flex-row items-start justify-between gap-8 lg:gap-8 w-full">
          {/* Left Column: Heading & Action Buttons */}
          <div className="flex-1 max-w-2xl text-left flex flex-col items-start">
            {onToggle && (
              <div className="mb-4">
                <ThemeToggle dark={dark} onToggle={onToggle} />
              </div>
            )}

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-zinc-100 leading-tight mb-4 text-left">
              <span className="text-5xl sm:text-6xl md:text-7xl block">Hi, I'm Christian.</span>
              <span className="block mt-2">I'm a Full Stack Developer</span>
              <span className="text-accent block mt-1">&amp; UI/UX Designer</span>
            </h2>

            <div
              onMouseLeave={() => setHoveredBtn('talk')}
              className="relative inline-flex flex-row items-center justify-start mt-8 border border-accent bg-transparent p-0 overflow-hidden w-fit"
              style={{ borderRadius: 0 }}
            >
              {/* Solid Accent Background Slider without opacity fade */}
              <motion.div
                className="absolute top-0 bottom-0 left-0 bg-accent-dark z-0 pointer-events-none"
                style={{
                  borderRadius: 0,
                  opacity: 1,
                }}
                animate={{
                  left: slider.left,
                  width: slider.width,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 38,
                }}
              />

              {/* LET'S TALK Button */}
              <button
                ref={talkBtnRef}
                id="about-lets-talk"
                onClick={scrollToContact}
                onMouseEnter={() => setHoveredBtn('talk')}
                className={`relative z-10 flex justify-center items-center gap-2 text-xs font-bold px-5 sm:px-6 py-3.5 transition-colors duration-150 active:scale-95 whitespace-nowrap ${hoveredBtn === 'talk'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-zinc-300 hover:text-accent'
                  }`}
                style={{ borderRadius: 0, letterSpacing: '1px' }}
              >
                LET'S TALK <FaArrowRight size={11} />
              </button>

              {/* DOWNLOAD RESUME Button */}
              <button
                ref={resumeBtnRef}
                id="about-download-resume"
                onClick={openPasswordModal}
                onMouseEnter={() => setHoveredBtn('resume')}
                className={`relative z-10 flex justify-center items-center gap-2 text-xs font-bold px-5 sm:px-6 py-3.5 transition-colors duration-150 active:scale-95 whitespace-nowrap ${hoveredBtn === 'resume'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-zinc-300 hover:text-accent'
                  }`}
                style={{ borderRadius: 0, letterSpacing: '1px' }}
              >
                <FaDownload size={11} /> DOWNLOAD RESUME
              </button>
            </div>
          </div>

          {/* Right Column: 3D Interactive Desk Lamp */}
          <div className="w-full lg:w-1/2 flex items-start justify-center lg:justify-end h-[360px] sm:h-[440px] lg:h-[500px]">
            <div className="w-full h-full max-w-xl">
              <CursorLamp className="w-full h-full" onGround={handleGround} dark={dark} enabled={!lampOff} />
            </div>
          </div>
        </div>
      </section>

      <div className="dark space-y-24 md:space-y-32" style={slabVars}>
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3">
          {[
            { value: '10+', label: 'Projects Delivered' },
            { value: '97.5%', label: 'Client Satisfaction' },
            { value: '2 YRS', label: 'Freelance Experience' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="group relative flex flex-col items-center justify-center text-center py-10 sm:py-14 md:py-16 px-6 bg-transparent rounded-none border-0 overflow-hidden cursor-default"
            >
              {/* Subtle base top line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10" />

              {/* Light beam sweeping across top border on hover (plays once) */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
                <span className="absolute top-0 left-0 h-full w-2/5 -translate-x-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:animate-[borderLight_1s_ease-out_forwards]" />
              </div>

              <p className="text-3xl md:text-4xl font-extrabold text-accent tracking-tight">{value}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-zinc-400 mt-2 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Top Projects Bento Grid ── */}
        <section>
          <div className="mb-10 md:mb-14 text-left">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] sm:leading-[1.1]">
              <span className="block">Where innovation,</span>
              <span className="block">meets the podium.</span>
            </h2>
          </div>

          {(() => {
            const TOP_IDS = ['O See', 'KeTox', 'CamScope', 'OsmenaAccess'];
            const topProjects = TOP_IDS.map(n => projects.find(p => p.name === n)).filter(Boolean);
            const [hero, ...rest] = topProjects;
            const getOptUrl = (url) => url ? url.replace('/upload/', '/upload/w_800,f_auto,q_auto/') : '';

            return (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                {/* Hero card — large, spans 3 cols */}
                {hero && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-3 relative group rounded-2xl overflow-hidden flex flex-col min-h-[460px] sm:min-h-[520px]"
                  >
                    <div className="relative w-full h-full flex-1 overflow-hidden min-h-[380px]">
                      <img
                        src={hero.image}
                        alt={hero.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <h3 className="text-lg font-bold text-white mb-1">{hero.name}</h3>
                      <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 max-w-lg mb-3">{hero.shortDesc}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="badge bg-white/15 text-white/90 backdrop-blur-sm">{hero.type}</span>
                        <span className="badge bg-white/15 text-white/90 backdrop-blur-sm">{hero.tech}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Stacked right cards — spans 2 cols */}
                <div className="lg:col-span-2 flex flex-col justify-start gap-5">
                  {rest.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 * (i + 1) }}
                      className="flex flex-col group"
                    >
                      <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden border border-zinc-700/60 bg-zinc-800/80">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="mt-2.5">
                        <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>

        {/* ── Tech Stack Marquee ── */}
        <div ref={techRef} className="-mx-6 md:-mx-8 py-6 sm:py-10">
          <TechMarquee />
        </div>


      </div>

      {/* ── Testimonials ── */}
      <section className="relative -mx-6 md:-mx-8 px-6 md:px-8 pt-20 md:pt-28 pb-6 sm:pb-10">
        {/* 3D stars behind the cards */}
        <StarsBackground dark={dark} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-gray-900 dark:text-zinc-100 mb-8 sm:mb-12 tracking-tight">
            What Clients Say
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} onClick={setSelectedTestimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section id="contact-section" className="relative -mx-6 md:-mx-8 px-6 md:px-8 py-16 md:py-24" style={{ background: DESK_COLOR }}>
        {/* Matching wave: black rises into the light testimonials area */}
        <WaveEdge flip className="absolute left-0 w-full h-28 md:h-44" style={{ bottom: 'calc(100% - 1px)' }} />
        <ContactSection dark={dark} />
      </section>

      <AnimatePresence>
        {selectedTestimonial && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTestimonial(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl p-6 md:p-8 z-10 max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
              >
                <FaTimes size={12} />
              </button>

              <div className="flex gap-1 mb-4 mt-2">
                {Array.from({ length: Math.floor(selectedTestimonial.rating) }).map((_, i) => (
                  <FaStar key={i} className="text-accent text-sm" />
                ))}
                {selectedTestimonial.rating % 1 !== 0 && (
                  <FaStarHalfAlt className="text-accent text-sm" />
                )}
              </div>

              <div className="max-h-[50vh] overflow-y-auto pr-4 mb-8 custom-scrollbar">
                <p className="text-sm md:text-base text-gray-600 dark:text-zinc-300 leading-relaxed italic">
                  "{selectedTestimonial.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div>
                  <p className="text-base font-bold text-gray-900 dark:text-zinc-100">{selectedTestimonial.name}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">{selectedTestimonial.role}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-2xl p-6 z-10"
              style={{ borderRadius: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
                style={{ borderRadius: 0 }}
              >
                <FaTimes size={12} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <FaLock className="text-accent" size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-zinc-100 uppercase" style={{ letterSpacing: '1px' }}>Security Check</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">To avoid bots & scrapers :&lt;</p>
                </div>
              </div>

              <div className="relative mb-1">
                <input
                  ref={passwordInputRef}
                  id="resume-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                  placeholder="Password"
                  className={`w-full px-4 py-3 pr-10 text-sm bg-gray-50 dark:bg-zinc-800 border ${passwordError
                    ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
                    : 'border-gray-200 dark:border-zinc-700 focus:ring-accent'
                    } text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                  style={{ borderRadius: 0 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>

              <p className="text-[11px] text-red-500 dark:text-red-400 italic mb-4 font-medium">Password: 909-251*</p>

              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 dark:text-red-400 mb-3"
                >
                  Incorrect password. Please try again.
                </motion.p>
              )}

              <button
                id="resume-download-confirm"
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-bold py-3 transition-all duration-200 active:scale-95 shadow"
                style={{ borderRadius: 0, letterSpacing: '1px' }}
              >
                <FaDownload size={12} /> Download Resume
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
