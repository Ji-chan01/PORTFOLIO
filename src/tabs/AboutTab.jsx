import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillBar from '../components/about/SkillBar';
import TestimonialCard from '../components/about/TestimonialCard';
import {
  frontendSkills, mobileSkills, backendSkills, designSkills
} from '../data/skills';
import { testimonials } from '../data/testimonials';
import {
  FaCode, FaHeart, FaChess, FaBasketballBall, FaMusic, FaTimes, FaStar,
  FaDownload, FaArrowRight, FaLock, FaEye, FaEyeSlash
} from 'react-icons/fa';

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

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
const RESUME_URL = 'https://res.cloudinary.com/dlqxpz9pu/image/upload/fl_attachment/v1777878097/resume_aodtzc.pdf';

export default function AboutTab({ onTabChange }) {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);

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
      a.download = 'Christian_Jireh_Briol_Resume.pdf';
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

  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="p-6 md:p-8 space-y-14 bg-grid"
    >
      <section className="flex flex-col-reverse lg:flex-row gap-8 items-center">
        <div className="flex-1">
          <p className="section-subtitle">Introduction</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-zinc-100 leading-tight mb-4">
            Building Experiences.<br />
            Solving Problems.<br />
            <span className="text-accent">One Pixel at a Time.</span>
          </h2>
          <p className="text-sm font-semibold text-accent mb-5">
            UI/UX Designer &amp; Full-Stack Developer · 2 Years Freelance
          </p>


          <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
            Hi! I’m Christian Jireh, a full-stack developer and UI/UX designer with two years of freelance experience.
            I turn your ideas into clean, beautiful, and highly functional digital products that users love. I handle everything from Figma design to reliable backends (Django & PHP) and polished frontends (React & Tailwind CSS).
          </p>
          <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed max-w-2xl mt-3">
            What sets me apart is my design-first approach, I always keep the end user in mind at every step.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 mt-6">
            <button
              id="about-lets-talk"
              onClick={() => onTabChange?.('Contact')}
              className="w-full sm:w-auto flex justify-center items-center gap-2 bg-accent-dark text-white text-xs font-bold px-6 py-3 transition-all duration-200 hover:brightness-90 active:scale-95 shadow-sm hover:shadow-md"
              style={{ borderRadius: 0, letterSpacing: '1px' }}
            >
              Let's Talk <FaArrowRight size={11} />
            </button>
            <button
              id="about-download-resume"
              onClick={openPasswordModal}
              className="w-full sm:w-auto flex justify-center items-center gap-2 border border-accent bg-[#f5f5f5] dark:bg-zinc-900 text-accent text-xs font-bold px-6 py-3 transition-all duration-200 hover:bg-accent hover:text-white active:scale-95"
              style={{ borderRadius: 0, letterSpacing: '1px' }}
            >
              <FaDownload size={11} /> Download Resume
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
          <div className="relative inline-flex">
            <img src="https://res.cloudinary.com/dlqxpz9pu/image/upload/f_auto,q_auto,w_800/v1777873480/me_aobggp.png" loading="lazy" alt="Christian Jireh A. Briol" className="max-w-full h-auto rounded-3xl" />

            <div
              className="absolute bottom-0 left-0 right-0 h-2/5 rounded-b-3xl pointer-events-none dark:hidden"
              style={{
                background: 'linear-gradient(to top, rgba(245,245,245,1) 0%, rgba(245,245,245,0.6) 50%, transparent 100%)',
              }}
            />

            <div
              className="absolute bottom-0 left-0 right-0 h-2/5 rounded-b-3xl pointer-events-none hidden dark:block"
              style={{
                background: 'linear-gradient(to top, rgba(24,24,27,1) 0%, rgba(24,24,27,0.6) 50%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 bg-[#f5f5f5] dark:bg-zinc-900">
        {[
          { value: '9+', label: 'Projects Delivered' },
          { value: '100%', label: 'Client Satisfaction' },
          { value: '2 Yrs', label: 'Freelance Experience' },
        ].map(({ value, label }, i) => (
          <div key={label} className={`p-6 text-center ${i === 0 ? 'sm:shadow-[inset_-40px_0_30px_-20px_rgb(var(--color-accent)/0.15)]' :
            i === 1 ? 'border-y sm:border-y-0 shadow-[inset_40px_0_30px_-20px_rgb(var(--color-accent)/0.15),inset_-40px_0_30px_-20px_rgb(var(--color-accent)/0.15)]' :
              i === 2 ? 'sm:shadow-[inset_40px_0_30px_-20px_rgb(var(--color-accent)/0.15)]' : ''
            }`}>
            <p className="text-4xl font-extrabold text-accent">{value}</p>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <section>
        <p className="section-subtitle">Technologies</p>
        <h2 className="section-title mb-6">Skills &amp; Proficiency</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <SkillGroup title="Frontend Development" skills={frontendSkills} barColor="bg-accent" delay={0} />
            <SkillGroup title="Mobile Development" skills={mobileSkills} barColor="bg-blue-400 dark:bg-red-400" delay={600} />
          </div>
          <div>
            <SkillGroup title="Backend & Full-Stack" skills={backendSkills} barColor="bg-violet-500" delay={0} />
            <SkillGroup title="Design Tools" skills={designSkills} barColor="bg-blue-400 dark:bg-red-400" delay={400} />
          </div>
        </div>
      </section>

      <section>
        <p className="section-subtitle">Social Proof</p>
        <h2 className="section-title mb-6">What Clients Say</h2>

        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
          {testimonials.map((t, i) => (
            <div key={t.id} className="w-[85%] sm:w-[calc(50%-0.5rem)] xl:w-[calc(33.333%-0.66rem)] flex-shrink-0 snap-start">
              <TestimonialCard testimonial={t} index={i} onClick={setSelectedTestimonial} />
            </div>
          ))}
        </div>
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
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl p-6 md:p-8 z-10"
            >
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
              >
                <FaTimes size={12} />
              </button>

              <div className="flex gap-1 mb-4 mt-2">
                {Array.from({ length: selectedTestimonial.rating }).map((_, i) => (
                  <FaStar key={i} className="text-accent text-sm" />
                ))}
              </div>

              <p className="text-sm md:text-base text-gray-600 dark:text-zinc-300 leading-relaxed italic mb-8">
                "{selectedTestimonial.text}"
              </p>

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
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Required to download resume</p>
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
