// Public commercial terms. Keep route-specific and SKU-specific conditions explicit.
export const businessFacts = {
  factoryLocation: 'Guangzhou, China',
  readyStock: {
    trial: 'Selected ready-stock styles may support a trial from 20 pcs per style, subject to live stock confirmation. 50 pcs per style is a common trial reference; matching sets are counted in sets, not individual garments. Mixing colors and sizes depends on available stock.',
    dispatch: 'Confirmed ready-stock styles without customization can usually be dispatched in 2–3 days after stock confirmation. Dispatch is not delivery to the destination country.',
    sample: 'Ready-stock sample cost is confirmed for the selected style.',
  },
  oem: {
    moq: 'OEM/ODM MOQ is usually 150–250 pcs per style per color, depending on design, fabric, construction and order requirements.',
    sampleFee: 'OEM sample fee is usually USD 70/pc. It is non-refundable and is not credited against the bulk order.',
    sampleDevelopment: 'Sample development usually takes 7–10 days after requirements are confirmed; revisions and project scope can change the schedule.',
    bulkProduction: 'Bulk production usually takes 25–35 days after the style, materials, sample and order requirements are finally approved.',
  },
  shipping: 'Freight cost, DDP availability, transit time and taxes are confirmed for the destination, chargeable weight and actual logistics route. Production and dispatch times do not include transit or customs clearance.',
} as const;

export const businessFactsEs = {
  factoryLocation: 'Guangzhou, China',
  readyStockTrial: 'Algunos modelos de stock admiten pruebas desde 20 unidades por modelo, sujetas a la disponibilidad real. 50 unidades por modelo son una referencia habitual; los conjuntos se cuentan por sets. Mezclar colores y tallas depende del stock.',
  readyStockDispatch: 'Los modelos en stock confirmado y sin personalización suelen poder despacharse en 2–3 días. Es tiempo hasta el envío, no hasta la llegada al país de destino.',
  readyStockSample: 'El coste de la muestra de stock se confirma según el modelo elegido.',
  oemMoq: 'El MOQ habitual de OEM/ODM es de 150–250 unidades por modelo y color, según diseño, tejido, confección y requisitos del pedido.',
  oemSampleFee: 'La muestra OEM suele costar USD 70 por unidad. No se reembolsa ni se descuenta del pedido de producción.',
  oemSampleDevelopment: 'El desarrollo de la muestra suele tardar 7–10 días tras confirmar los requisitos; las revisiones y el alcance pueden modificar el plazo.',
  oemBulkProduction: 'La producción suele tardar 25–35 días tras aprobar definitivamente modelo, materiales, muestra y requisitos del pedido.',
  shipping: 'El flete, la disponibilidad de DDP, el tránsito y los impuestos se confirman según destino, peso facturable y ruta logística. Producción y despacho no incluyen tránsito ni aduana.',
} as const;
