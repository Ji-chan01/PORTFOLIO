import { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import ProjectCard from '../components/portfolio/ProjectCard';
import ProjectModal from '../components/portfolio/ProjectModal';

export default function PortfolioTab() {
  const [selected, setSelected] = useState(null);

  return (
    <motion.div
      key="portfolio"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 md:p-8 bg-grid"
    >
      <p className="section-subtitle">My Work</p>
      <h2 className="section-title mb-2">Portfolio</h2>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8 max-w-xl">
        A curated selection of projects spanning web apps, desktop systems, mobile applications,
        and UI/UX design — each built end-to-end with a design-first approach.
      </p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onOpen={setSelected}
          />
        ))}
      </div>

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </motion.div>
  );
}
