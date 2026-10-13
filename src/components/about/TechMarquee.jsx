import { useRef, useEffect } from 'react';

/**
 * Tech stack items with SVG icons from devicon CDN.
 * Each entry: { name, icon (devicon slug), color (brand hex) }
 */
const TECH_STACKS = [
  { name: 'HTML5', icon: 'html5', color: '#E34F26' },
  { name: 'CSS3', icon: 'css3', color: '#1572B6' },
  { name: 'JavaScript', icon: 'javascript', color: '#F7DF1E' },
  { name: 'React', icon: 'react', color: '#61DAFB' },
  { name: 'React Native', icon: 'react', color: '#61DAFB' },
  { name: 'Tailwind CSS', icon: 'tailwindcss', color: '#06B6D4' },
  { name: 'Bootstrap', icon: 'bootstrap', color: '#7952B3' },
  { name: 'Python', icon: 'python', color: '#3776AB' },
  { name: 'Django', icon: 'django', color: '#092E20' },
  { name: 'PHP', icon: 'php', color: '#777BB4' },
  { name: 'VB.NET', icon: 'dot-net', color: '#512BD4' },
  { name: 'Figma', icon: 'figma', color: '#F24E1E' },
  { name: 'Git', icon: 'git', color: '#F05032' },
  { name: 'GitHub', icon: 'github', color: '#ffffff' },
  { name: 'VS Code', icon: 'vscode', color: '#007ACC' },
  { name: 'Arduino', icon: 'arduino', color: '#00878F' },
  { name: 'Raspberry Pi', icon: 'raspberrypi', color: '#A22846' },
  { name: 'MySQL', icon: 'mysql', color: '#4479A1' },
];

const ICON_URL = (slug) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`;

// Django and GitHub don't have "-original", use "-plain"
const ICON_URL_ALT = {
  django: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg`,
  github: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg`,
  'dot-net': `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg`,
};

function TechItem({ name, icon, color }) {
  const src = ICON_URL_ALT[icon] || ICON_URL(icon);
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-transparent whitespace-nowrap flex-shrink-0 group cursor-default select-none">
      <img
        src={src}
        alt={name}
        className="w-7 h-7 object-contain group-hover:scale-110 transition-transform duration-300 pointer-events-none select-none"
        loading="lazy"
        draggable={false}
      />
      <span className="text-xl font-semibold text-zinc-300 group-hover:text-white transition-colors select-none">
        {name}
      </span>
    </div>
  );
}

export default function TechMarquee() {
  const scrollRef = useRef(null);
  const animRef = useRef(null);
  const speed = 0.5; // px per frame

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let offset = 0;
    const halfWidth = el.scrollWidth / 2;

    const tick = () => {
      offset += speed;
      if (offset >= halfWidth) offset = 0;
      el.style.transform = `translateX(-${offset}px)`;
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Duplicate the list so the scroll loops seamlessly
  const items = [...TECH_STACKS, ...TECH_STACKS];

  return (
    <div className="w-full overflow-hidden py-2" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}>
      <div ref={scrollRef} className="flex gap-6 items-center will-change-transform">
        {items.map((t, i) => (
          <TechItem key={`${t.name}-${i}`} {...t} />
        ))}
      </div>
    </div>
  );
}
