// Studio-stage backdrop: spotlight from above, light pool on the floor,
// faint perspective grid and film grain. Edges fade to pure black (#000)
// so it blends with the sections above and below.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function StageBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black">
      {/* 1. Spotlight cone from above.
          Blur lives on the wrapper and the clip-path on the inner div, so the blur
          softens the cone edges instead of being cut off by the clip. */}
      <div
        className="absolute left-1/2 top-[-12%] h-[115%] w-[90%] -translate-x-1/2"
        style={{ filter: 'blur(40px)' }}
      >
        <div
          className="h-full w-full"
          style={{
            clipPath: 'polygon(49% 0, 51% 0, 88% 100%, 12% 100%)',
            background:
              'linear-gradient(to bottom, rgba(186,214,255,0.34) 0%, rgba(96,165,250,0.16) 50%, rgba(59,130,246,0.05) 100%)',
          }}
        />
      </div>

      {/* 2. Pool of light on the stage floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            'radial-gradient(55% 55% at 50% 78%, rgba(59,130,246,0.22) 0%, rgba(30,64,175,0.10) 45%, transparent 75%)',
        }}
      />

      {/* 3. Perspective grid floor */}
      <div
        className="absolute inset-x-[-20%] bottom-0 h-[45%] opacity-[0.16]"
        style={{
          transform: 'perspective(500px) rotateX(62deg)',
          transformOrigin: 'bottom center',
          backgroundImage:
            'linear-gradient(to right, rgba(147,197,253,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(147,197,253,0.55) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(60% 90% at 50% 100%, #000 0%, transparent 75%)',
          maskImage: 'radial-gradient(60% 90% at 50% 100%, #000 0%, transparent 75%)',
        }}
      />

      {/* 4. Film grain */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }}
      />

      {/* 5. Edge fade to black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #000 0%, transparent 18%, transparent 82%, #000 100%), radial-gradient(120% 90% at 50% 50%, transparent 55%, #000 100%)',
        }}
      />
    </div>
  );
}
