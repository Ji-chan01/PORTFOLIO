import { useRef, useEffect } from 'react';

/**
 * Tech stack items with SVG icons from the devicon CDN.
 * Each entry: { name, icon (devicon slug) }
 */
const TECH_STACKS = [
  { name: 'HTML5', icon: 'html5' },
  { name: 'CSS3', icon: 'css3' },
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'React', icon: 'react' },
  { name: 'React Native', icon: 'react' },
  { name: 'Tailwind CSS', icon: 'tailwindcss' },
  { name: 'Bootstrap', icon: 'bootstrap' },
  { name: 'Python', icon: 'python' },
  { name: 'Django', icon: 'django' },
  { name: 'PHP', icon: 'php' },
  { name: 'VB.NET', icon: 'dot-net' },
  { name: 'Figma', icon: 'figma' },
  { name: 'Git', icon: 'git' },
  { name: 'GitHub', icon: 'github' },
  { name: 'VS Code', icon: 'vscode' },
  { name: 'Arduino', icon: 'arduino' },
  { name: 'Raspberry Pi', icon: 'raspberrypi' },
  { name: 'MySQL', icon: 'mysql' },
];

// "@latest" means the icons can change or disappear without any change on your side.
// Pin it to a release (e.g. "devicon@v2.16.0") once you've confirmed every icon above exists in that version.
const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

// Most icons use the "-original" artwork; these only ship a "-plain" one.
const PLAIN_ICONS = new Set(['django']);

const iconUrl = (slug) =>
  `${DEVICON_BASE}/${slug}/${slug}-${PLAIN_ICONS.has(slug) ? 'plain' : 'original'}.svg`;

function TechItem({ name, icon }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-transparent whitespace-nowrap flex-shrink-0 group cursor-default select-none">
      <img
        src={iconUrl(icon)}
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

// Same pace as before (0.5 px per frame at 60 fps), but now independent of the screen's refresh rate.
const SPEED_PX_PER_SEC = 30;

export default function TechMarquee() {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    // The track holds the list twice, so one full loop is exactly half of its width.
    // Re-measured whenever the width changes (web fonts loading, window resize).
    const setDuration = () => {
      const loop = el.scrollWidth / 2;
      if (loop > 0) el.style.setProperty('--marquee-duration', `${loop / SPEED_PX_PER_SEC}s`);
    };
    setDuration();
    const resizeObserver = new ResizeObserver(setDuration);
    resizeObserver.observe(el);

    // Pause while off-screen so it costs nothing. The scrolling itself is a CSS animation (see .marquee-track in index.css).
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
    visibilityObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  // Duplicate the list so the scroll loops seamlessly
  const items = [...TECH_STACKS, ...TECH_STACKS];

  return (
    <div className="w-full overflow-hidden py-2" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}>
      {/* w-max + pr-6 (= the gap) make the track exactly two list-lengths wide, so translateX(-50%) loops with no jump */}
      <div ref={trackRef} className="marquee-track flex gap-6 pr-6 w-max items-center will-change-transform">
        {items.map((t, i) => (
          <TechItem key={`${t.name}-${i}`} {...t} />
        ))}
      </div>
    </div>
  );
}
