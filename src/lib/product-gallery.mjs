// Keep descriptive image ALT separate from the existing short gallery caption.
export function readGalleryItem(thumbnail) {
  const label = thumbnail.getAttribute('aria-label')?.replace(/^View\s+/, '') || '';
  return {
    src: thumbnail.querySelector('img')?.getAttribute('src') || '',
    alt: thumbnail.dataset.galleryAlt || label,
    label: thumbnail.dataset.galleryLabel || label,
  };
}
