import { productCatalog, type CatalogProduct } from './productCatalog';

export type ReadyStockCatalogProduct = CatalogProduct & {
  logoAvailable: boolean;
  sampleAvailable: boolean;
  availabilityNote: string;
};

// A product enters this programme only when its catalog MOQ is the confirmed
// 50-piece/50-set ready-stock route. Actual colours and size mixes are always
// confirmed with the buyer before an order is accepted.
export const readyStockCatalog: ReadyStockCatalogProduct[] = productCatalog
  .filter((product) => /^50 (sets|pcs)$/i.test(product.moq))
  .map((product) => ({
    ...product,
    logoAvailable: true,
    sampleAvailable: true,
    availabilityNote: 'Confirm current colours and size mix',
  }));
