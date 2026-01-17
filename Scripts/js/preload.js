// js/preload.js
export function preloadImages(imageMap, onComplete) {
  const entries = Object.entries(imageMap);
  let loaded = 0;

  if (entries.length === 0) {
    onComplete?.();
    return;
  }

  entries.forEach(([_, src]) => {
    const img = new Image();
    img.src = src;
    img.onload = img.onerror = () => {
      loaded++;
      if (loaded === entries.length) onComplete?.();
    };
  });
}
