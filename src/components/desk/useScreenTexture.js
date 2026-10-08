import { useMemo } from 'react';
import * as THREE from 'three';

/*
  Screen text texture: white ALL-CAPS text on a near-black background.
  Visibility is controlled outside (material opacity), so this is drawn once.

  ─── Tunable ───
  SCREEN_TEXT : the brand message (rendered with .toUpperCase())
  BG_COLOR    : canvas background
  GLOW_BLUR   : shadowBlur for the text glow
*/

export const SCREEN_TEXT = 'TELL ME ABOUT YOUR PROJECT! 😄';

const BG_COLOR = '#05070d';
const GLOW_BLUR = 20;
const GLOW_COLOR = 'rgba(255, 255, 255, 0.5)';
const FONT_FAMILY = "'Poppins', system-ui, sans-serif";

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? cur + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Shrink the font until every line fits in 80% of the width and the block in 70% of the height. */
function fitText(ctx, text, w, h) {
  const maxW = w * 0.8;
  const maxH = h * 0.7;
  const lhRatio = 1.3;
  let size = 180;
  let lines;
  while (size > 24) {
    ctx.font = `bold ${size}px ${FONT_FAMILY}`;
    lines = wrapText(ctx, text, maxW);
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    if (lines.length * size * lhRatio <= maxH && widest <= maxW) break;
    size -= 4;
  }
  return { fontSize: size, lines, lineHeight: size * lhRatio };
}

function paintText(ctx, w, h) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, w, h);

  const text = SCREEN_TEXT.toUpperCase();
  const { fontSize, lines, lineHeight } = fitText(ctx, text, w, h);

  ctx.font = `bold ${fontSize}px ${FONT_FAMILY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = GLOW_COLOR;
  ctx.shadowBlur = GLOW_BLUR;
  ctx.fillStyle = '#ffffff';

  const totalH = (lines.length - 1) * lineHeight;
  const startY = h / 2 - totalH / 2;
  lines.forEach((line, i) => {
    const y = startY + i * lineHeight;
    ctx.fillText(line, w / 2, y);
    ctx.fillText(line, w / 2, y); // second pass = stronger glow
  });

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

/**
 * Plain (non-hook) factory. Call it once you know the screen's real aspect ratio.
 * Repaints automatically once the web font has loaded.
 */
export function createScreenTexture(aspect = 1.35) {
  const w = 1024;
  const h = Math.round(w / aspect);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  paintText(ctx, w, h);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;

  if (document.fonts?.load) {
    document.fonts
      .load(`bold 100px ${FONT_FAMILY}`)
      .then(() => {
        paintText(ctx, w, h);
        tex.needsUpdate = true;
      })
      .catch(() => { });
  }
  return tex;
}

/** Hook version, kept for compatibility. */
export default function useScreenTexture(aspect = 1.35) {
  return useMemo(() => createScreenTexture(aspect), [aspect]);
}
