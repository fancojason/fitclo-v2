export type MarketLandingPage = {
  slug: string;
  name: string;
  buyerFocus: string;
  launchContext: string;
  planningPriorities: [string, string, string];
  faqFocus: string;
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
