/**
 * DeskPlaceholder – static loading placeholder shown while the 3D scene loads.
 * Displays a themed gradient with a shimmer animation and "Loading desk…" text.
 */
export default function DeskPlaceholder({ isDark = true }) {
  const bgColor = isDark
    ? 'linear-gradient(135deg, #18181b 0%, #1e1b2e 50%, #18181b 100%)'
    : 'linear-gradient(135deg, #f5f5f5 0%, #e8edf5 50%, #f5f5f5 100%)';

  const textColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
  const shimmerColor = isDark
    ? 'rgba(251, 113, 133, 0.08)'
    : 'rgba(8, 102, 255, 0.08)';

  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-none"
      style={{ background: bgColor, minHeight: '30vh' }}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
          animation: 'shimmer 2s infinite ease-in-out',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Loading text */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin"
          style={{ color: textColor }}
        />
        <p style={{ color: textColor }} className="text-sm font-medium tracking-wide">
          Loading desk…
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
