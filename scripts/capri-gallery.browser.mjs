// Run checkCapriGallery.toString() in a real browser after loading a Capri page.
// This exercises the page's own handlers; it does not replace the gallery code.
export async function checkCapriGallery(expectedInquiryType = 'Sample') {
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const gallery = document.querySelector('[data-product-gallery]');
  const buttons = [...gallery.querySelectorAll('button[data-gallery-thumbnail]')];
  const caption = gallery.querySelector('figcaption [data-gallery-label]');
  const main = gallery.querySelector('[data-gallery-main]');
  assert(gallery.querySelectorAll('figcaption [data-gallery-label]').length === 1, 'caption selector must be unique');
  assert(caption && !caption.closest('button'), 'caption must be a figcaption text element, never a thumbnail button');
  assert(buttons.length === 5, 'five thumbnail buttons required');
  const expected = buttons.map(button => ({
    src: button.querySelector('img')?.getAttribute('src'),
    alt: button.dataset.galleryAlt,
    label: button.dataset.galleryLabel || button.getAttribute('aria-label').replace(/^View\s+/, ''),
  }));
  assert(expected.every(item => item.src && item.alt), 'all five thumbnails must retain an image and descriptive ALT metadata');
  const initialCaption = caption.textContent.trim();
  const verify = async (index, label = expected[index].label) => {
    await new Promise((resolve, reject) => {
      if (main.complete) return main.naturalWidth ? resolve() : reject(new Error('main image failed'));
      main.addEventListener('load', resolve, { once: true });
      main.addEventListener('error', () => reject(new Error('main image failed')), { once: true });
    });
    assert(main.getAttribute('src') === expected[index].src, `image ${index + 1}: source`);
    assert(main.alt === expected[index].alt, `image ${index + 1}: full ALT`);
    assert(caption.textContent.trim() === label, `image ${index + 1}: short caption`);
    assert(buttons.every((b, i) => b.querySelector('img')?.getAttribute('src') === expected[i].src), 'all five thumbnail images must survive');
    assert(buttons.every((b, i) => b.getAttribute('aria-pressed') === String(i === index)), 'aria-pressed must match active image');
    assert(buttons[0].querySelector('img').getBoundingClientRect().width > 0, 'first thumbnail must remain visible');
    return { image: index + 1, thumbnails: 5, src: main.getAttribute('src'), alt: main.alt, caption: caption.textContent.trim(), ariaPressed: true };
  };
  // Localized SSR captions intentionally differ from their existing aria labels.
  // Check the unchanged initial caption before testing click-driven captions.
  assert(initialCaption === { en: 'Matching series', es: 'Serie a juego', de: 'Passende Serie' }[document.documentElement.lang], 'original initial localized caption must be preserved');
  const initial = await verify(0, initialCaption);
  buttons[1].click();
  const second = await verify(1);
  const images = [];
  for (let i = 0; i < 5; i++) { buttons[i].click(); images.push(await verify(i)); }
  gallery.querySelector('[data-gallery-next]').click();
  await verify(0);
  gallery.querySelector('[data-gallery-previous]').click();
  await verify(4);
  buttons[0].click();
  await verify(0);
  assert(document.documentElement.scrollWidth <= innerWidth, 'horizontal overflow');
  assert(caption.getBoundingClientRect().top >= main.getBoundingClientRect().bottom, 'caption must not overlap main image');
  assert(document.querySelector('select[name="inquiry_type"]').value === expectedInquiryType, 'inquiry default differs from test expectation');
  return { url: location.href, lang: document.documentElement.lang, width: innerWidth, scrollWidth: document.documentElement.scrollWidth, initial, second, images, wrapNext: true, wrapPrevious: true, sample: expectedInquiryType };
}
