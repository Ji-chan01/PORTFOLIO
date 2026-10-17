import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import CursorLamp from '../components/3d design/lamp/CursorLamp';
import SkillBar from '../components/about/SkillBar';
import TechMarquee from '../components/about/TechMarquee';
import KeySkills from '../components/about/KeySkills';
import TestimonialCard from '../components/about/TestimonialCard';
import StarsBackground from '../components/about/StarsBackground';
import ContactSection from '../components/about/ContactSection';
// import RotatingWord from '../components/about/RotatingWord';
import StageBackdrop from '../components/about/StageBackdrop';
import {
  frontendSkills, mobileSkills, backendSkills, designSkills
} from '../data/skills';
import { testimonials } from '../data/testimonials';
import { projects } from '../data/projects';
import {
  FaCode, FaHeart, FaChess, FaBasketballBall, FaMusic, FaTimes, FaStar, FaStarHalfAlt,
  FaDownload, FaArrowRight, FaLock, FaEye, FaEyeSlash,
  FaGraduationCap, FaRocket, FaLayerGroup, FaClock
} from 'react-icons/fa';

// "Why hire me?" timeline rows (alternate left / right)
const WHY_ME = [
  {
    icon: FaGraduationCap,
    title: 'Honors Graduate',
    meta: 'Computer Science · April 2026',
    bullets: [
      'Graduated Cum Laude in Computer Science',
      'Finished with a 1.51 GWA',
      'Most of what I know came from building things for real people',
    ],
  },
  {
    icon: FaRocket,
    title: 'Shipping Since Day One',
    meta: 'Freelance · 2+ years',
    bullets: [
      '10+ web, mobile, and desktop apps delivered',
      'Built for schools and research teams',
      'Everything from the database to the screen someone actually taps',
    ],
  },
  {
    icon: FaLayerGroup,
    title: 'The Stack I Reach For',
    meta: 'Frontend · Backend · Databases',
    bullets: [
      'Most at home in React, Node.js/Express, and Django',
      'Backed by MySQL, SQLite, or SQL Server, whichever the project calls for',
    ],
  },
  {
    icon: FaClock,
    title: 'Reliable by Default',
    meta: '100% on-time delivery',
    bullets: [
      'Every project has gone out on time',
      'Full stack development and UI/UX design, with a good sense of both frontend and backend development, solo or with a team',
    ],
  },
];

// One timeline row. Hidden until the growing line reaches its icon, then the icon glows
// and the card + bullets slide in from their side.
function WhyMeRow({ item, left, active, nodeRef }) {
  const reduce = useReducedMotion();
  const Icon = item.icon;
  const show = active || reduce;

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-x-20 pl-14 md:pl-0">
      <span
        ref={nodeRef}
        className={`absolute left-5 md:left-1/2 top-6 -translate-x-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-950 border transition-colors duration-500 ${active ? 'border-accent text-accent' : 'border-gray-300 dark:border-white/15 text-gray-400 dark:text-zinc-500'
          }`}
      >
        <span className={`absolute inset-0 rounded-full bg-accent/50 blur-md transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`} />
        <Icon size={15} className="relative" />
      </span>

      <motion.div
        initial={false}
        animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: left ? -140 : 140 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`${left ? 'md:col-start-1' : 'md:col-start-2'} p-6 text-left`}
      >
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
        <p className="text-xs italic text-gray-500 dark:text-zinc-400 mt-1 mb-4">{item.meta}</p>
        <ul className="space-y-2.5 text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
          {item.bullets.map((b, j) => (
            <motion.li
              key={b}
              initial={false}
              animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: left ? -50 : 50 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: show ? 0.2 + j * 0.15 : 0 }}
              className="flex gap-3"
            >
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
              <span>{b}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

// Timeline: no line at first. It is drawn from the top as you scroll, and each icon
// lights up (with its card) when the end of the line reaches it.
function WhyMeTimeline() {
  const ref = useRef(null);
  const fillRef = useRef(null);
  const nodeRefs = useRef([]);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const head = window.innerHeight * 0.65; // the line's tip sits at 65% of the screen height
      const h = Math.max(0, Math.min(r.height, head - r.top));
      if (fillRef.current) fillRef.current.style.height = `${h}px`;

      let n = 0;
      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        const nr = node.getBoundingClientRect();
        if (h >= nr.top + nr.height / 2 - r.top) n = i + 1;
      });
      setReached(n);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // capture = true so this also fires when the page scrolls inside a container, not just the window
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        ref={fillRef}
        aria-hidden="true"
        className="absolute top-0 left-5 md:left-1/2 -translate-x-1/2 w-px h-0 bg-accent text-accent transition-[filter] duration-500"
        style={{ filter: `drop-shadow(0 0 ${reached > 0 ? 8 : 3}px currentColor)` }}
      />
      <div className="space-y-10 md:space-y-16">
        {WHY_ME.map((item, i) => (
          <WhyMeRow
            key={item.title}
            item={item}
            left={i % 2 === 0}
            active={i < reached}
            nodeRef={(el) => (nodeRefs.current[i] = el)}
          />
        ))}
      </div>
    </div>
  );
}

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
const RESUME_URL = 'https://res.cloudinary.com/dlqxpz9pu/image/upload/fl_attachment/v1791895690/Christian_Jireh_Briol_Resume_yyx05x.pdf';

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
  const heroSceneRef = useRef(null);
  const talkBtnRef = useRef(null);
  const resumeBtnRef = useRef(null);
  const [slider, setSlider] = useState({ left: 0, width: 0 });
  const [lampOff, setLampOff] = useState(false); // true while the stats cards are on screen
  const [lampLit, setLampLit] = useState(false); // true when the lamp light is actively on
  const [hoveringCredits, setHoveringCredits] = useState(false);

  const scrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    const updateSlider = () => {
      const target = hoveredBtn === 'resume' ? resumeBtnRef.current : talkBtnRef.current;
      if (target && target.offsetWidth > 0) {
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
      if (!r.width) return; // not laid out (hidden): nothing to measure, and don't store bogus 0 positions
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
      data-lamp-root="true"
      key="about"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="relative isolate px-6 md:px-8 pt-3 md:pt-2 space-y-24 md:space-y-32"
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

      <section className="relative flex flex-col justify-start pt-12 pb-6 !mt-0">
        <div className="relative flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-8 w-full">
          {/* Left Column: Heading & Action Buttons */}
          <div className="relative z-10 flex-1 max-w-2xl text-left flex flex-col items-start w-full">
            {onToggle && (
              <div className="mb-4 hidden lg:block">
                <ThemeToggle dark={dark} onToggle={onToggle} />
              </div>
            )}

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-zinc-100 leading-tight mb-4 text-left">
              <span className="text-5xl sm:text-6xl md:text-7xl block">Hi, I'm Christian.</span>
              <span className="block mt-2">I'm a Full Stack Developer</span>
              <span className="text-accent block mt-1">&amp; UI/UX Designer</span>
            </h2>

            {/* Mobile Layout: Separate buttons, each taking 100% width */}
            <div className="flex flex-col gap-3 w-full mt-8 sm:hidden">
              <button
                id="about-lets-talk-mobile"
                onClick={scrollToContact}
                className="w-full flex justify-center items-center gap-2 text-xs font-bold py-3.5 px-6 bg-accent text-white dark:text-black border border-accent active:scale-[0.98] transition-transform shadow-sm"
                style={{ borderRadius: 0, letterSpacing: '1px' }}
              >
                LET'S TALK <FaArrowRight size={11} />
              </button>
              <button
                id="about-download-resume-mobile"
                onClick={openPasswordModal}
                className="w-full flex justify-center items-center gap-2 text-xs font-bold py-3.5 px-6 bg-transparent text-gray-900 dark:text-zinc-100 border border-accent hover:bg-accent/10 active:scale-[0.98] transition-colors"
                style={{ borderRadius: 0, letterSpacing: '1px' }}
              >
                <FaDownload size={11} /> DOWNLOAD RESUME
              </button>
            </div>

            {/* Desktop Layout: Joined slider buttons */}
            <div
              onMouseLeave={() => setHoveredBtn('talk')}
              className="relative hidden sm:inline-flex flex-row items-center justify-start mt-8 border border-accent bg-transparent p-0 overflow-hidden w-fit"
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
                  ? 'text-white dark:text-black'
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
                  ? 'text-white dark:text-black'
                  : 'text-gray-700 dark:text-zinc-300 hover:text-accent'
                  }`}
                style={{ borderRadius: 0, letterSpacing: '1px' }}
              >
                <FaDownload size={11} /> DOWNLOAD RESUME
              </button>
            </div>
          </div>

          {/* Right Column: 3D Interactive Desk Lamp (Desktop only) */}
          <div className="hidden lg:flex lg:w-1/2 h-[500px] items-start justify-end">
            <div className="w-full h-full max-w-xl relative">
              <CursorLamp className="w-full h-full" onGround={handleGround} onLight={setLampLit} dark={dark} enabled={!lampOff} />
              <p
                onMouseEnter={() => setHoveringCredits(true)}
                onMouseLeave={() => setHoveringCredits(false)}
                className={`absolute bottom-[-5px] right-2 z-40 text-[9px] text-zinc-500 select-none whitespace-nowrap transition-opacity duration-500 ${lampLit && !hoveringCredits ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                  }`}
              >
                <a
                  href="https://sketchfab.com/3d-models/desk-lamp-7377ec591df04445a1aae370017aaa13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors duration-300"
                >
                  Desk lamp
                </a>{' '}
                by{' '}
                <a
                  href="https://sketchfab.com/BlueHour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors duration-300"
                >
                  KaramellGlass
                </a>{' '}
                is licensed under{' '}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors duration-300"
                >
                  Creative Commons Attribution
                </a>
              </p>
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

        {/* ── Why Hire Me (alternating timeline) ── */}
        <section className="relative -mx-6 md:-mx-8 px-6 md:px-8 overflow-hidden">
          {/* Earth at night (dark mode only), fades into the page on every side */}


          <div className="relative z-10 max-w-5xl mx-auto py-16 md:py-24">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14 md:mb-20 flex flex-col items-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-gray-900 dark:text-white">
                <span className="block">Why hire me?</span>
                <span className="block text-accent">Let the work answer.</span>
              </h2>
            </motion.div>

            {/* Timeline */}
            <WhyMeTimeline />
          </div>
        </section>

        {/* ── Innovation Statement (Full Screen) ── */}
        <section
          ref={heroSceneRef}
          className="relative -mx-6 md:-mx-8 px-6 md:px-8 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center overflow-hidden"
        >
          <StageBackdrop />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center pointer-events-none"
          >
            <h2 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] sm:leading-[1.1]">
              <span className="block">
                Where <span className="text-[#64748B]" >innovation</span>,
              </span>
              <span className="block mt-2 sm:mt-3">
                meets the{' '}
                <span className="relative inline-block">
                  podium
                  {/* curved underline, revealed left to right when the heading scrolls into view */}
                  <motion.svg
                    aria-hidden="true"
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    className="absolute left-0 w-full h-[6px] sm:h-[8px] -bottom-[0.14em] overflow-visible pointer-events-none"
                    initial={{ clipPath: 'inset(-10px 100% -10px -10px)' }}
                    whileInView={{ clipPath: 'inset(-10px -10px -10px -10px)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                  >
                    <path
                      d="M0 2 Q50 6 100 2"
                      fill="none"
                      stroke="#1E50BE"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </motion.svg>
                </span>

              </span>
            </h2>
          </motion.div>
        </section>

        {/* ── Top Projects Bento Grid ── */}
        <section className="px-6 md:px-8">

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
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5, delay: 0.12 * (i + 1), ease: [0.22, 1, 0.36, 1] }}
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
        {/* techRef marks where the black slab ends, so Key Skills lives inside it (above the wave) */}
        <div ref={techRef} className="-mx-6 md:-mx-8 py-6 sm:py-10">
          <TechMarquee />

          {/* ── Key Skills (from résumé) ── */}
          <div className="px-6 md:px-8">
            <KeySkills />
          </div>
        </div>


      </div>

      {/* ── Testimonials ── */}
      <section className="relative -mx-6 md:-mx-8 px-6 md:px-8 pt-20 md:pt-28 pb-6 sm:pb-10">
        {/* 3D stars behind the cards */}
        <StarsBackground dark={dark} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-zinc-100 mb-8 sm:mb-12 tracking-tight"
          >
            What Clients Say
          </motion.h2>

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

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedTestimonial && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedTestimonial(null)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-xl md:max-w-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] flex flex-col"
                >
                  <button
                    onClick={() => setSelectedTestimonial(null)}
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-500 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <FaTimes size={12} />
                  </button>

                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: Math.floor(selectedTestimonial.rating) }).map((_, i) => (
                      <FaStar key={i} className="text-accent text-sm" />
                    ))}
                    {selectedTestimonial.rating % 1 !== 0 && (
                      <FaStarHalfAlt className="text-accent text-sm" />
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-3 my-2 custom-scrollbar">
                    <p className="text-sm md:text-base text-gray-600 dark:text-zinc-300 leading-relaxed font-normal">
                      "{selectedTestimonial.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 mt-2 border-t border-gray-100 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/60 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{selectedTestimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 dark:text-zinc-100">{selectedTestimonial.name}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">
                        @{selectedTestimonial.name.toLowerCase().replace(/\s+/g, '')}
                        <span className="mx-1.5 opacity-60">•</span>
                        {selectedTestimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {showPasswordModal && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPasswordModal(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
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
          </AnimatePresence>,
          document.body
        )}
    </motion.div>
  );
}
