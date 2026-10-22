// Cloudinary delivery transforms: right-sized width, best format (WebP/AVIF) and automatic quality.
// Without these, the browser downloads the original upload at full resolution.

export function optimizeImage(url, width) {
  if (!url || !url.includes('/upload/')) return url || '';
  return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
}

// srcset string so the browser picks the smallest width that still looks sharp.
export function imageSrcSet(url, widths) {
  return widths.map((w) => `${optimizeImage(url, w)} ${w}w`).join(', ');
}
