export type MarketLandingPage = {
  slug: string;
  name: string;
  buyerFocus: string;
  launchContext: string;
  planningPriorities: [string, string, string];
  faqFocus: string;
  seoTitle?: string;
  metaDescription?: string;
  headline?: string;
  quickAnswer?: string;
  inquiryMessage?: string;
  localPlanningTitle?: string;
  localPlanningIntro?: string;
  localPlanningCards?: [string, string][];
  resourceLinks?: [string, string, string][];
  additionalFaqs?: { question: string; answer: string }[];
};

export const marketLandingPages: MarketLandingPage[] = [
  {
    slug: 'united-states',
    name: 'United States',
    buyerFocus: 'DTC activewear brands, studio merchandise programmes, retailers and wholesale buyers building a clear assortment.',
    launchContext: 'Plan a core activewear line around fit consistency, colour options and a size mix that suits your intended customer.',
    planningPriorities: ['Confirm the category mix before selecting styles.', 'Align size grading and fit comments during sampling.', 'Choose branding and pack-out details before bulk approval.'],
    faqFocus: 'US activewear buyers',
  },
  {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    buyerFocus: 'Independent fitness labels, ecommerce sellers, studios and retailers sourcing a practical private-label or ready-stock range.',
    launchContext: 'Start with styles and fabrics that match the intended training, yoga or everyday-athleisure use, then confirm the size and colour plan.',
    planningPriorities: ['Build a concise launch assortment before requesting a quotation.', 'Review a physical sample for fit and fabric hand feel.', 'Confirm import and delivery paperwork with your own logistics partner.'],
    faqFocus: 'UK activewear buyers',
    seoTitle: 'UK Activewear Manufacturer & Wholesale Supplier | Fitclo',
    metaDescription: 'Source ready-stock, private-label and OEM activewear for UK brands. Compare MOQ, samples, sizing, branding, quality checks and delivery scope with Fitclo.',
    headline: 'Private-label and wholesale activewear for UK brands.',
    quickAnswer: 'Fitclo supplies UK activewear brands through ready-stock, private-label and OEM/ODM routes. Ready-stock MOQ starts from 50 sets for coordinated sets or 50 pcs for individual garments. Send the product category, expected quantity, size and colour mix, branding needs and UK delivery destination so suitable styles, samples and shipment scope can be matched to the actual brief.',
    inquiryMessage: 'Hello Fitclo, I am sourcing activewear for the UK. My product category is [category], estimated quantity is [quantity], and I need [ready stock / private label / OEM]. Please advise suitable styles, MOQ, sample and delivery options.',
    localPlanningTitle: 'Turn a UK buying brief into a quote the supplier can act on.',
    localPlanningIntro: 'A useful request identifies the customer, assortment and delivery scope before price comparison. These inputs help reduce unclear assumptions during sampling and quotation.',
    localPlanningCards: [
      ['Assortment and sizing', 'Plan the launch around a focused category mix, intended customer and size breakdown. Confirm the actual size chart and sample fit before bulk approval.'],
      ['Brand presentation', 'Confirm the logo method, main and care labels, hang tags, packaging artwork and placement as part of the product brief.'],
      ['Import handoff', 'Compare quotes against the same Incoterm and named place, then confirm importer details, document scope, duties, taxes and final-delivery responsibility with your appointed UK adviser.'],
    ],
    resourceLinks: [
      ['UK wholesale gym wear sourcing guide', 'Compare buying routes, product selection and the information to prepare before requesting a quote.', '/blogs/wholesale-gym-wear-uk-sourcing-guide/'],
      ['UK private-label activewear guide', 'Review the decisions behind product selection, samples, branding components and bulk approval.', '/blogs/private-label-activewear-manufacturer-uk/'],
      ['FOB, DAP and DDP explained', 'Use the same named place and service scope when comparing international shipment quotations.', '/blogs/fob-vs-ddp-vs-dap-activewear-imports/'],
    ],
    additionalFaqs: [
      {
        question: 'What should a UK buyer include in an activewear quotation request?',
        answer: 'Include the product category or style references, estimated quantity, size and colour mix, branding requirements, target delivery location and preferred sourcing route. A UK postcode and the required shipment scope also help the supplier compare the correct delivery options.',
      },
      {
        question: 'Can a UK buyer start with ready stock and move to OEM later?',
        answer: 'Yes. A buyer can use suitable ready-stock products to test a focused assortment, add private-label components where available, and prepare a separate OEM/ODM brief when new fabrics, measurements or construction details are required.',
      },
    ],
  },
  {
    slug: 'germany',
    name: 'Germany',
    buyerFocus: 'Activewear brands and buying teams that need clear product specifications, repeatable fit and an organised sampling route.',
    launchContext: 'Use a documented brief to align fabrics, construction, colour references and brand components before bulk production.',
    planningPriorities: ['Share a measurement chart or fit reference early.', 'Decide whether ready stock, private label or OEM fits the project.', 'Review labelling and import needs with qualified local advisers.'],
    faqFocus: 'German activewear buyers',
  },
  {
    slug: 'france',
    name: 'France',
    buyerFocus: 'Yoga, Pilates, fitness and lifestyle brands sourcing coordinated sets, leggings, sports bras and studio-ready layers.',
    launchContext: 'Balance the collection silhouette with practical purchasing inputs: fabric direction, target quantity, colours and branding requirements.',
    planningPriorities: ['Choose performance fabric based on the use case, not only appearance.', 'Confirm the desired product finish on an approved sample.', 'Plan label, hang-tag and packaging information before bulk.'],
    faqFocus: 'French activewear buyers',
  },
  {
    slug: 'netherlands',
    name: 'Netherlands',
    buyerFocus: 'Ecommerce operators, distributors and emerging activewear labels looking for a manageable first or repeat order.',
    launchContext: 'A compact, well-specified collection is easier to sample, evaluate and reorder than a broad range without a clear size or colour plan.',
    planningPriorities: ['Start with commercially focused styles and a realistic quantity.', 'Use samples to review construction, measurements and logo placement.', 'Confirm logistics documentation for the actual shipment route.'],
    faqFocus: 'Netherlands activewear buyers',
  },
  {
    slug: 'australia',
    name: 'Australia',
    buyerFocus: 'Activewear brands, gym owners, Pilates studios and retailers sourcing performance-led yoga sets and training staples.',
    launchContext: 'Define the collection use case first—studio, gym, lifestyle or seasonal drop—then select fabric, size range and branding route.',
    planningPriorities: ['Match product construction to low-, medium- or high-movement use.', 'Review fit and coverage during the sample stage.', 'Ask for current ready-stock availability before confirming an order.'],
    faqFocus: 'Australian activewear buyers',
    seoTitle: 'Australian Activewear Manufacturer & Wholesale Supplier | Fitclo',
    metaDescription: 'Source ready-stock, private-label and OEM activewear for Australian brands. Compare MOQ, samples, fabrics, branding, quality checks and delivery scope.',
    headline: 'Private-label and wholesale activewear for Australian brands.',
    quickAnswer: 'Fitclo supplies Australian activewear brands through ready-stock, private-label and OEM/ODM routes. Ready-stock MOQ starts from 50 sets for coordinated sets or 50 pcs for individual garments. Share the intended activity, product category, quantity, size and colour mix, branding needs and Australian destination so suitable styles, samples and shipment scope can be matched to the brief.',
    inquiryMessage: 'Hello Fitclo, I am sourcing activewear for Australia. My product category is [category], estimated quantity is [quantity], and I need [ready stock / private label / OEM]. Please advise suitable styles, MOQ, sample and delivery options.',
    localPlanningTitle: 'Build an Australian activewear brief around use, fit and delivery scope.',
    localPlanningIntro: 'A clear quotation request connects the intended activity and customer to the size, colour, branding and shipment decisions the supplier needs to confirm.',
    localPlanningCards: [
      ['Climate and use case', 'Define whether the styles are for Pilates, gym training, running, lifestyle or layering, then review fabric hand feel, coverage and recovery against that use.'],
      ['Size and colour plan', 'Confirm the intended size mix and launch colours before ordering. Request current colour and size availability for ready-stock styles.'],
      ['Import handoff', 'Confirm the Incoterm, named place, consignee or importer details, document scope, duties, taxes and final-delivery responsibility with your appointed Australian adviser.'],
    ],
    resourceLinks: [
      ['Australia wholesale gym wear sourcing guide', 'Compare activewear buying routes, product categories and the information needed for a useful quotation.', '/blogs/wholesale-gym-wear-australia-sourcing-guide/'],
      ['Australian private-label activewear guide', 'Review samples, branding choices, specifications and bulk-production checkpoints.', '/blogs/private-label-activewear-manufacturer-australia/'],
      ['Sustainable activewear sourcing in Australia', 'Prepare evidence-based material and supplier questions without relying on vague sustainability claims.', '/blogs/sustainable-activewear-manufacturer-australia/'],
    ],
    additionalFaqs: [
      {
        question: 'What should an Australian buyer include in an activewear quotation request?',
        answer: 'Include the intended activity, product category or style references, estimated quantity, size and colour mix, branding requirements, delivery destination and preferred sourcing route. The destination postcode and shipment scope help the supplier compare the correct delivery options.',
      },
      {
        question: 'Can an Australian buyer combine ready stock and custom development?',
        answer: 'Yes. Suitable ready-stock products can support an initial or replenishment assortment, while a separate private-label or OEM/ODM brief can cover branding, new fabrics, measurements or construction details. Each route should be quoted against its own confirmed scope.',
      },
    ],
  },
  {
    slug: 'canada',
    name: 'Canada',
    buyerFocus: 'Brands and retailers combining core training styles with layers, sets and product options for varied seasonal merchandising.',
    launchContext: 'Use sampling to validate the intended fabric weight, recovery and layering suitability before committing to a bulk order.',
    planningPriorities: ['Choose fabric and silhouette according to the intended wear season.', 'Check size mix and colour plan against the launch assortment.', 'Confirm destination paperwork with a customs or logistics specialist.'],
    faqFocus: 'Canadian activewear buyers',
  },
  {
    slug: 'japan',
    name: 'Japan',
    buyerFocus: 'Detail-oriented activewear buyers looking for controlled fit, refined construction and a clearly documented product brief.',
    launchContext: 'Bring measurement points, fabric expectations and finish requirements into the sample review so the bulk brief is unambiguous.',
    planningPriorities: ['Provide clear fit comments after sample review.', 'Confirm labels, hang tags and packaging as part of the final brief.', 'Coordinate shipment documents against the confirmed import route.'],
    faqFocus: 'Japanese activewear buyers',
  },
  {
    slug: 'south-korea',
    name: 'South Korea',
    buyerFocus: 'Fashion-aware fitness labels, online sellers and studios sourcing coordinated sets, seamless styles and performance essentials.',
    launchContext: 'Combine a strong visual direction with defined fabric, fit and branding information so samples can be evaluated efficiently.',
    planningPriorities: ['Use reference images with measurable construction notes.', 'Confirm colour standards before production approval.', 'Keep the initial category range focused for faster buyer feedback.'],
    faqFocus: 'South Korean activewear buyers',
  },
  {
    slug: 'uae',
    name: 'UAE',
    buyerFocus: 'Retailers, gym concepts, studio brands and ecommerce sellers sourcing polished activewear assortments for an international customer base.',
    launchContext: 'Select product options around the expected use case and brand positioning, then plan samples, labels and delivery documentation together.',
    planningPriorities: ['Clarify product coverage and fabric hand-feel expectations.', 'Confirm branding and packaging before the pre-production approval.', 'Verify destination-specific import requirements with a qualified local party.'],
    faqFocus: 'UAE activewear buyers',
  },
  {
    slug: 'mexico',
    name: 'Mexico',
    buyerFocus: 'Growing fitness brands, distributors and online stores sourcing ready-stock activewear or developing a branded collection.',
    launchContext: 'Choose a buying route that fits the launch goal: ready stock for faster assortment testing, private label for brand presentation or OEM for a new design.',
    planningPriorities: ['Identify the quantity and size mix before requesting a quote.', 'Approve construction and fit with a sample where appropriate.', 'Plan documentation and the delivery route before bulk dispatch.'],
    faqFocus: 'Mexican activewear buyers',
  },
  {
    slug: 'brazil',
    name: 'Brazil',
    buyerFocus: 'Activewear labels and retailers looking for yoga sets, leggings, sports bras and trend-aware fitness collections.',
    launchContext: 'A clear brief lets the product team compare fabric, construction, colour and branding options before moving through sampling and bulk production.',
    planningPriorities: ['Prioritise fabric recovery, coverage and the intended activity level.', 'Set the logo, label and packaging plan alongside the product brief.', 'Confirm the import route and documents before shipment.'],
    faqFocus: 'Brazilian activewear buyers',
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    buyerFocus: 'Boutique brands, wellness concepts, studios and ecommerce sellers building a concise, premium-looking activewear edit.',
    launchContext: 'Begin with a focused assortment, then use samples to make practical decisions on fabric feel, fit, branding and final presentation.',
    planningPriorities: ['Keep the first order focused on the strongest categories.', 'Confirm fabric performance expectations in writing.', 'Coordinate lead-time and shipment plans after sample approval.'],
    faqFocus: 'Singapore activewear buyers',
  },
  {
    slug: 'saudi-arabia',
    name: 'Saudi Arabia',
    buyerFocus: 'Fitness brands, retailers, studios and online businesses sourcing polished activewear for a focused customer proposition.',
    launchContext: 'Use the product brief to align coverage, fabric, fit, size range and branding details before approving a sample or bulk order.',
    planningPriorities: ['Define the intended wearer and product coverage requirements.', 'Review the sample for fit, construction and colour direction.', 'Confirm destination documentation with the appointed logistics provider.'],
    faqFocus: 'Saudi Arabian activewear buyers',
  },
  {
    slug: 'spain',
    name: 'Spain',
    buyerFocus: 'Yoga, Pilates, gym and lifestyle activewear buyers sourcing a commercial mix of sets, leggings, bras and lightweight layers.',
    launchContext: 'Use a product-focused brief to compare ready-stock options and private-label development without making unnecessary commitments too early.',
    planningPriorities: ['Build the line around the core categories customers will recognise.', 'Use samples to confirm fabric hand feel and measurements.', 'Check labelling and import details before shipment with your advisers.'],
    faqFocus: 'Spanish activewear buyers',
  },
  {
    slug: 'italy',
    name: 'Italy',
    buyerFocus: 'Design-conscious activewear labels and retailers seeking defined construction, considered fabric choices and a coherent collection.',
    launchContext: 'A robust technical and visual brief helps align silhouette, measurements, colour direction and branded finishing before production.',
    planningPriorities: ['Use references that show both design and construction intent.', 'Confirm fabric, trim and branding options at the sample stage.', 'Prepare packaging and delivery information before bulk confirmation.'],
    faqFocus: 'Italian activewear buyers',
  },
  {
    slug: 'poland',
    name: 'Poland',
    buyerFocus: 'Activewear brands, online sellers and retailers looking for practical sourcing routes for fitness, yoga and athleisure collections.',
    launchContext: 'Start from a defined assortment and size plan, then select the right route—ready stock, private label or OEM—based on the project scope.',
    planningPriorities: ['Confirm which styles are suitable for current ready-stock checks.', 'Use samples to verify fit, grading and quality expectations.', 'Coordinate paperwork and delivery through the confirmed import route.'],
    faqFocus: 'Polish activewear buyers',
  },
];

export const marketLandingPaths = marketLandingPages.map((market) => `/wholesale-to/${market.slug}/`);
