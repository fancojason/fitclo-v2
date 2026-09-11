// Keep media requests out of the initial page load, including autoplay browsers.
const videos = document.querySelectorAll<HTMLVideoElement>('video[data-lazy-factory]');
const loadVideo = (video: HTMLVideoElement) => {
  video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
    source.src = source.dataset.src!;
    source.removeAttribute('data-src');
  });
  video.load();
  video.play().catch(() => { video.controls = true; });
};
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      loadVideo(target as HTMLVideoElement);
    });
  }, { rootMargin: '300px 0px' });
  videos.forEach((video) => observer.observe(video));
} else {
  videos.forEach(loadVideo);
}
