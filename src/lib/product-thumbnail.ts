import thumbnails from './product-thumbnails.json';

export function productThumbnail(src: string) {
  const srcset = (thumbnails as Record<string, string>)[src];
  return srcset ? {
    srcset,
    sizes: '(min-width: 1024px) 80px, (min-width: 640px) calc((100vw - 178px) / 5), calc((100vw - 162px) / 5)',
  } : {};
}
