import { useState, useEffect } from 'react';

/*
  DeskOverlay – DOM overlay on top of the 3D canvas.
  - Shows a caption per active camera preset.
  - Keyboard-accessible buttons to switch presets.
*/

const CAPTIONS = {
  default: '',
  laptop: 'Where the design turns into code.',
  coffee: 'Fuel for late nights.',
};

const PRESET_LABELS = [
  { key: 'default', label: 'Overview' },
  { key: 'laptop', label: 'Laptop' },
  { key: 'coffee', label: 'Coffee' },
];

export default function DeskOverlay({ activePreset = 'default', onPresetSelect }) {
  const [caption, setCaption] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (activePreset === 'default') {
      setVisible(false);
      const t = setTimeout(() => setCaption(''), 400);
      return () => clearTimeout(t);
    }
    setCaption(CAPTIONS[activePreset] || '');
    // Small delay to let fade-in look intentional
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [activePreset]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-5">
      {/* Caption */}
      <div className="flex-1 flex items-end justify-center pb-14 sm:pb-16">
        <p
          className="text-white/90 text-xs sm:text-sm font-medium tracking-wide text-center transition-all duration-500 drop-shadow-lg"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          {caption}
        </p>
      </div>

      {/* Preset buttons */}
      <div className="flex items-center justify-center gap-2 pointer-events-auto">
        {PRESET_LABELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onPresetSelect?.(key)}
            aria-label={`View ${label}`}
            className={`
              px-3 py-1.5 text-[10px] sm:text-xs font-semibold tracking-wider uppercase rounded-full
              backdrop-blur-md border transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/40
              ${activePreset === key
                ? 'bg-white/25 border-white/40 text-white shadow-lg'
                : 'bg-black/30 border-white/10 text-white/60 hover:bg-white/15 hover:text-white/90'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
