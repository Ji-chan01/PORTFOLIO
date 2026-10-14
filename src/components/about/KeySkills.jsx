import { motion, useReducedMotion } from 'framer-motion';
import { SiReact, SiNodedotjs, SiFigma } from 'react-icons/si';
import { FaMobileAlt, FaUsers } from 'react-icons/fa';

// Content comes from the résumé: skills, projects and experience.
const SKILLS = [
  {
    title: ['React', 'Developer'],
    detail: 'Responsive React and Tailwind CSS interfaces for schools and research teams.',
    icon: SiReact,
    tint: '97,218,251',
  },
  {
    title: ['Backend', 'Developer'],
    detail: 'REST APIs with Node.js, Express, Django, and Flask, backed by MySQL, SQL Server, and MongoDB.',
    icon: SiNodedotjs,
    tint: '95,160,78',
  },
  {
    title: ['UI/UX', 'Designer'],
    detail: 'Figma interfaces behind CamScope and KetoX, both 1st place at DSTF Masbate.',
    icon: SiFigma,
    tint: '242,78,30',
  },
  {
    title: ['Mobile & Desktop', 'Developer'],
    detail: 'Cross-platform mobile apps with React Native & Expo, and desktop software built with VB.NET & MySQL.',
    icon: FaMobileAlt,
    tint: '147,197,253',
  },
  {
    title: ['Team', 'Leader'],
    detail: 'Led the O See capstone team: A* pathfinding, 360° directions, and offline use.',
    icon: FaUsers,
    tint: '250,204,21',
  },
];

export default function KeySkills() {
  const reduce = useReducedMotion();

  return (
    <section className="relative pt-32 sm:pt-40 ">
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-5 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          How I Can Contribute &amp; My Key Skills
        </motion.h2>

        <div className="mt-10 grid w-full grid-cols-2 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {SKILLS.map(({ title, detail, icon: Icon, tint }, i) => (
            <motion.article
              key={title.join(' ')}
              // tabIndex lets tap / keyboard focus trigger the same effect as hover on touch screens
              tabIndex={0}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: 'easeOut' }}
              className={`group relative flex aspect-[1/1.85] flex-col outline-none ${i === SKILLS.length - 1 ? 'col-span-2 mx-auto w-1/2 sm:col-span-1 sm:w-full' : ''
                }`}
            >
              {/* TOP BOX: icon, plus the description once the card opens */}
              <div className="relative flex-1 overflow-hidden bg-[#0e0e10] transition-colors duration-500 group-hover:bg-[#242836] group-focus:bg-[#242836]">
                {/* soft glow behind the icon, in the brand colour */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[38%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 group-focus:opacity-100"
                  style={{ background: `rgba(${tint},0.28)` }}
                />

                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-10 group-focus:-translate-y-10 sm:group-hover:-translate-y-12 sm:group-focus:-translate-y-12">
                  <Icon
                    aria-hidden="true"
                    className="relative h-16 w-16 transition-transform duration-500 ease-out group-hover:scale-105 group-focus:scale-105 sm:h-20 sm:w-20"
                    style={{ color: `rgb(${tint})`, filter: `drop-shadow(0 10px 14px rgba(${tint},0.35))` }}
                  />
                </div>

                <p className="absolute inset-x-4 bottom-4 translate-y-3 text-center text-[11px] leading-snug text-zinc-300 opacity-0 transition-all delay-100 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100 sm:bottom-6 sm:text-sm sm:leading-relaxed">
                  {detail}
                </p>
              </div>

              {/* BOTTOM BOX: title. Slides down on hover, opening a gap between the two boxes */}
              <div className="flex h-24 shrink-0 items-center justify-center bg-[#0e0e10] px-4 text-center transition-all duration-500 ease-out group-hover:translate-y-3 group-hover:bg-[#1b1e2b] group-focus:translate-y-3 group-focus:bg-[#1b1e2b] sm:h-28">
                <h3 className="text-base font-semibold leading-snug text-zinc-100 sm:text-lg">
                  {title.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
