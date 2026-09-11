import images from './home-images.json';

export function homeImage(src: string) {
  return { ...images[src as keyof typeof images], loading: 'lazy' as const, decoding: 'async' as const };
}
