import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  FaGraduationCap, FaTrophy, FaBriefcase, FaCertificate,
  FaCheckCircle, FaUsers, FaCode, FaExpand, FaTimes
} from 'react-icons/fa';

function TimelineItem({ icon: Icon, title, subtitle, period, children }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
          <Icon className="text-accent" size={15} />
        </div>
        <div className="w-0.5 flex-1 bg-gray-100 dark:bg-zinc-700 mt-2" />
      </div>
      <div className="pb-8 flex-1">
        <p className="text-xs text-accent font-semibold mb-0.5">{period}</p>
        <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-0.5">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">{subtitle}</p>
        <div className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

const certs = [
  { id: 1, title: 'DICT OJT Certificate 1', subtitle: 'Department of ICT · 2023', color: 'from-blue-500 to-indigo-600', image: null },
  { id: 2, title: 'DICT OJT Certificate 2', subtitle: 'Department of ICT · 2023', color: 'from-rose-500 to-red-600', image: null },
  { id: 3, title: 'DICT OJT Certificate 3', subtitle: 'Department of ICT · 2023', color: 'from-violet-500 to-purple-600', image: null },
  { id: 4, title: 'DICT OJT Certificate 4', subtitle: 'Department of ICT · 2023', color: 'from-emerald-500 to-teal-600', image: null },
  { id: 5, title: 'DICT OJT Certificate 5', subtitle: 'Department of ICT · 2023', color: 'from-amber-500 to-orange-600', image: null },
];

function CertCard({ cert, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card rounded-none overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className={`h-20 bg-gradient-to-br ${cert.color} flex items-center justify-center relative`}>
        {cert.image
          ? <img src={cert.image} alt={cert.title} className="h-full w-full object-cover" />
          : <FaCertificate className="text-white/80" size={28} />
        }
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
          <FaExpand className="text-white/0 group-hover:text-white/80 transition-all duration-200" size={16} />
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-gray-900 dark:text-zinc-100 truncate">{cert.title}</p>
        <p className="text-[10px] text-gray-500 dark:text-zinc-400">{cert.subtitle}</p>
      </div>
    </div>
  );
}

export default function ResumeTab() {
  const [selectedCert, setSelectedCert] = useState(null);
  return (
    <motion.div
      key="resume"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 md:p-8 bg-grid"
    >
      <div className="grid md:grid-cols-2 gap-10">
        {/* ── LEFT COLUMN ──────────────────────────────── */}
        <div>
          {/* Education */}
          <section className="mb-10">
            <p className="section-subtitle">Academic Background</p>
            <h2 className="section-title mb-6">Education</h2>

            <TimelineItem
              icon={FaGraduationCap}
              title="BS Information Technology"
              subtitle="Osmeña Colleges — Masbate City"
              period="2020 – 2024"
            >
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-red-900/40 rounded-lg text-xs font-bold text-blue-700 dark:text-red-400 mb-3">
                <FaTrophy size={10} /> Graduated Cum Laude
              </span>
              <p>
                Graduated with Cum Laude distinction, reflecting sustained academic excellence
                across four years of rigorous coursework in the information technology program.
              </p>
            </TimelineItem>

            <TimelineItem
              icon={FaTrophy}
              title="Dean's List — Four-Year Streak"
              subtitle="Osmeña Colleges"
              period="2020 – 2024 · All Semesters"
            >
              <p>
                Achieved Dean's Lister recognition consistently from 1st Year through 4th Year.
                Maintaining this honor required the same discipline I bring to professional projects:
                consistent effort, attention to detail, and the ability to perform under pressure.
              </p>
            </TimelineItem>
          </section>

          {/* Leadership */}
          <section>
            <p className="section-subtitle">Leadership</p>
            <h2 className="section-title mb-6">Extracurricular</h2>

            <TimelineItem
              icon={FaUsers}
              title="2nd Year Class President"
              subtitle="Osmeña Colleges"
              period="2021 – 2022"
            >
              <p>
                Served as Class President during my second year, acting as the primary liaison
                between students and faculty. Coordinated class-wide activities, resolved
                interpersonal concerns, and led group academic initiatives — sharpening
                communication, delegation, and decision-making skills.
              </p>
            </TimelineItem>

            <TimelineItem
              icon={FaTrophy}
              title="CCS 2nd Year Representative"
              subtitle="College of Computer Studies"
              period="2021 – 2022"
            >
              <p>
                Represented the College of Computer Studies as the 2nd Year departmental
                representative. Participated in department-level planning meetings, advocated
                for student interests, and helped organize CCS events — providing early
                exposure to stakeholder management.
              </p>
            </TimelineItem>
          </section>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────── */}
        <div>
          {/* Experience */}
          <section className="mb-10">
            <p className="section-subtitle">Work History</p>
            <h2 className="section-title mb-6">Experience</h2>

            <div className="card p-5 mb-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                  <FaBriefcase className="text-accent" size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                    Freelance Full-Stack Developer &amp; UI/UX Designer
                  </h3>
                  <p className="text-xs text-accent font-semibold">2023 – Present · Remote / Project-Based</p>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  'Designed and developed full-stack web and mobile applications for multiple clients across various industries',
                  'Led end-to-end project delivery: requirement gathering, wireframing, development, deployment, and post-launch support',
                  'Built responsive frontends using React, Tailwind CSS, and Vanilla JS',
                  'Architected backend systems using Django (Python) and PHP',
                  'Produced high-fidelity UI/UX prototypes in Figma prior to every development phase',
                  'Managed client communication, revision cycles, and delivery timelines independently',
                  'Delivered 6+ completed projects with a 100% client satisfaction rate',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                    <FaCheckCircle className="text-accent mt-0.5 flex-shrink-0" size={11} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-10">
            <p className="section-subtitle">Credentials</p>
            <h2 className="section-title mb-4">DICT OJT Certifications</h2>

            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-5">
              Recipient of 5 certificates from the Department of Information and Communications Technology
              (DICT) through On-the-Job Training. Click any certificate to view it.
            </p>

            {/* Row 1 — 2 certs */}
            <div className="grid grid-cols-2 gap-[3px] mb-[3px]">
              {certs.slice(0, 2).map((cert) => (
                <CertCard key={cert.id} cert={cert} onClick={() => setSelectedCert(cert)} />
              ))}
            </div>

            {/* Row 2 — 3 certs */}
            <div className="grid grid-cols-3 gap-[3px]">
              {certs.slice(2).map((cert) => (
                <CertCard key={cert.id} cert={cert} onClick={() => setSelectedCert(cert)} />
              ))}
            </div>
          </section>


        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full"
            >
              {/* Gradient Header */}
              <div className={`h-48 bg-gradient-to-br ${selectedCert.color} flex items-center justify-center`}>
                {selectedCert.image
                  ? <img src={selectedCert.image} alt={selectedCert.title} className="h-full w-full object-contain" />
                  : <FaCertificate className="text-white/70" size={72} />
                }
              </div>
              {/* Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-1">{selectedCert.title}</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{selectedCert.subtitle}</p>
              </div>
              {/* Close */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-black/30 hover:bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <FaTimes size={14} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
