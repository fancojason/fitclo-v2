export type CategorySourcingLandingPage = {
  slug: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  heroTitle: string;
  heroText: string;
  productCodes: string[];
  fabricNotes: string[];
  sizeNotes: string[];
  decisionRows: [string, string, string][];
  qualityChecks: string[];
  faqs: { question: string; answer: string }[];
  catalogPath: string;
  catalogLabel: string;
};

export const categorySourcingLandingPages: CategorySourcingLandingPage[] = [
  {
    slug: 'private-label-yoga-sets',
    eyebrow: 'PRIVATE LABEL YOGA SETS',
    title: 'Private Label Yoga Sets: MOQ, Fabrics, Sampling and Branding',
    seoTitle: 'Private Label Yoga Sets Manufacturer | MOQ, Sampling & Branding',
    description: 'Develop or source private label yoga sets with Fitclo. Compare ready-stock and custom routes, fabrics, size plans, samples, logos, packaging, quality checks and wholesale MOQ logic.',
    heroTitle: 'Build a private label yoga-set collection with decisions buyers can approve.',
    heroText: 'Start from proven coordinated sets or create a more original brief. Fitclo helps global buyers align the top, legging or flare-pant silhouette, fabric direction, size range, branding and sample route before bulk production.',
    productCodes: ['TZ4510-14', 'TZ5555-4', 'TZ4506-4'],
    fabricNotes: ['Nylon / spandex directions for smooth, supportive cut-and-sew yoga sets.', 'Brushed nylon / spandex for a softer hand feel where the selected style calls for it.', 'Seamless knitted polyamide / elastane options for selected sculpting or body-mapped sets.'],
    sizeNotes: ['Plan the size range and intended fit before the first sample.', 'Record top, underbust, waist, hip, rise and inseam points that matter for the selected set.', 'Confirm a size mix for ready-stock styles; for custom development, retain approved grading with the final specification.'],
    decisionRows: [['Launch route', 'Do you need a ready-stock capsule or a more original collection?', 'Selected styles, customisation level and quantity plan.'], ['Set construction', 'Which top, bottom, neckline, waistband and length fit the target activity?', 'Front/back references and product requirements.'], ['Fabric direction', 'Is softness, coverage, sculpting feel, cooling or recovery the priority?', 'Composition, hand-feel reference and colour direction.'], ['Brand presentation', 'Where should the logo, label, hang tag and packaging appear?', 'Artwork, placement, label and packing brief.']],
    qualityChecks: ['Review top and bottom fit together during the movements the collection is designed for.', 'Check coverage, waistband position, seams and recovery on the approved size and colorway.', 'Confirm logo placement, label information, hang tags and packaging against the signed-off sample.', 'Keep the approved sample, specification and color reference aligned before bulk packing.'],
    faqs: [
      { question: 'What is the MOQ for private label yoga sets?', answer: 'For the ready-stock programme, matching sets start from 50 sets. A custom or OEM/ODM route depends on the selected design, fabric, colours and branding requirements, so Fitclo confirms the workable MOQ after reviewing the brief.' },
      { question: 'Can I add my logo to a ready-stock yoga set?', answer: 'Yes. Logo application, labels, hang tags and packaging can be discussed for selected styles. Confirm the specific branding route, colour and size mix before order.' },
      { question: 'Can I request a yoga-set sample first?', answer: 'Yes. Send the style or reference, preferred colour, size and branding direction. The suitable sample route is confirmed before a wholesale or development order.' },
      { question: 'Which fabric is best for private label yoga sets?', answer: 'The best direction depends on the garment and target wearer. Nylon-spandex, brushed nylon-spandex and seamless knitted polyamide-elastane can suit different silhouettes; review the actual hand feel, coverage and recovery on a sample.' },
      { question: 'How should yoga sets be inspected before bulk shipment?', answer: 'Check fit, measurement points, fabric appearance, coverage, seams, waistband stability, branding and packing against the approved sample and documented specification.' },
    ],
    catalogPath: '/products/matching-sets/',
    catalogLabel: 'Browse Yoga & Matching Sets',
  },
  {
    slug: 'private-label-sports-bras',
    eyebrow: 'PRIVATE LABEL SPORTS BRAS',
    title: 'Private Label Sports Bras: Support, Sizing, Samples and Branding',
    seoTitle: 'Private Label Sports Bra Manufacturer | Support, Samples & MOQ',
    description: 'Source private label sports bras with Fitclo. Plan support intent, underband, straps, cups, size grading, samples, logo options, packaging, quality checks and wholesale MOQ logic.',
    heroTitle: 'Source sports bras by support intent, not just by a neckline photo.',
    heroText: 'A better private label sports-bra brief defines the activity, wearer, coverage, underband, straps, cup or pad choice, size plan and branding route. That gives buyers a concrete basis for sampling and approval.',
    productCodes: ['FC-BRA-127', 'FC-BRA-102', 'TZ4510-14'],
    fabricNotes: ['Nylon / spandex directions for smooth stretch, support and coordinated-set programs.', 'Seamless knit polyamide / elastane for selected body-mapped bras and shaping zones.', 'Lining, elastic and cup or pad choices are specified separately from the shell fabric.'],
    sizeNotes: ['Set support intent and the planned size range before fitting the first sample.', 'Record key points such as bust, underbust, strap length and garment length for the selected construction.', 'Use representative fit reviews when the range extends beyond one base size.'],
    decisionRows: [['Support intent', 'Yoga, studio training, running or another use case?', 'Target activity, coverage and expected stability.'], ['Underband and straps', 'How should the bra anchor and adjust during movement?', 'Band width, elastic direction, strap construction and hardware notes.'], ['Cups or pads', 'Lined, removable, molded, fixed or unpadded?', 'Cup/pad construction, placement and care requirements.'], ['Branding', 'Logo at chest, back, band or other area?', 'Artwork, location, labels, hang tags and packaging.']],
    qualityChecks: ['Test band stability, straps and coverage in the agreed activity movements.', 'Review cup or pad placement, seam comfort and recovery on the physical sample.', 'Confirm the selected size grading with measurement and fit feedback, not visual scaling alone.', 'Inspect logo, labels and packing against the approved reference before shipment.'],
    faqs: [
      { question: 'What should a private label sports bra brief include?', answer: 'Include target activity, support intent, neckline, coverage, shell and lining fabric, underband, straps, cups or pads, size range, measurements, logo placement, labels and packaging.' },
      { question: 'Can a sports bra be ordered with removable pads?', answer: 'That depends on the selected construction. State whether pads are removable, fixed, molded or not included, then review position, pocket construction and care requirements on the sample.' },
      { question: 'What is the sports bra MOQ?', answer: 'Ready-stock individual garments start from 50 pcs in the programme. Custom sports-bra MOQ depends on the style, materials, colour and branding brief, and is confirmed after review.' },
      { question: 'How do I check sports bra quality before bulk?', answer: 'Review support intent, underband stability, straps, cup or pad placement, coverage, seams, measurements, branding and packing against the approved sample.' },
      { question: 'Can Fitclo add logos, labels and packaging?', answer: 'Yes. Buyers can discuss logo application, labels, hang tags and packaging for private label sports-bra projects. The practical route is confirmed for the selected product and order.' },
    ],
    catalogPath: '/products/sports-bras/',
    catalogLabel: 'Browse Sports Bras',
  },
  {
    slug: 'seamless-activewear-manufacturer',
    eyebrow: 'SEAMLESS ACTIVEWEAR MANUFACTURER',
    title: 'Seamless Activewear Manufacturer: Development, MOQ and Quality Checks',
    seoTitle: 'Seamless Activewear Manufacturer | Private Label & OEM/ODM',
    description: 'Work with Fitclo on seamless activewear sourcing and development. Compare seamless knit styles, fabric direction, sizing, samples, logo and packaging options, quality checks and ready-stock routes.',
    heroTitle: 'Plan seamless activewear with the knit zones, fit and recovery in view.',
    heroText: 'Seamless leggings, bras and coordinated sets need a brief that looks beyond color and silhouette. Define the target use, knit feel, support areas, opacity expectations, size range and branding route before approving a sample.',
    productCodes: ['TZ2557-6', 'TZ4535-2', 'FC-BRA-102'],
    fabricNotes: ['Seamless knitted polyamide / elastane directions for stretch, recovery and body-mapped zones.', 'Knit construction, yarn selection and zone placement should be reviewed alongside composition.', 'Use a physical sample to assess hand feel, coverage and recovery rather than relying on a photo.'],
    sizeNotes: ['Identify the base size and intended range early because seamless fit changes with knit stretch.', 'Review waistband, body length, strap or armhole areas and coverage in movement.', 'Keep size grading, recovery observations and approved samples together in the final brief.'],
    decisionRows: [['Product direction', 'Leggings, shorts, bras, tanks or a coordinated set?', 'Silhouette, activity and key body zones.'], ['Knit performance', 'Where is stretch, shaping, breathability or coverage most important?', 'Yarn/fabric direction and zone priorities.'], ['Fit and grading', 'Which sizes must be physically reviewed?', 'Base size, POMs, grade direction and fit plan.'], ['Brand route', 'Ready-stock private label or a more custom knit development?', 'Logo, labels, packaging and quantity discussion.']],
    qualityChecks: ['Check fabric appearance and coverage at relevant stretch levels on the intended colorway.', 'Review recovery at waistband, knees, seat, straps and other high-stretch zones.', 'Inspect knit consistency, seams or joins, body mapping, labels and logo method against the approval reference.', 'Record the size, movement and correction request so feedback can be applied to the next sample.'],
    faqs: [
      { question: 'What is seamless activewear?', answer: 'Seamless activewear is commonly made with a knitted construction that can integrate stretch, texture or shaping zones. The final result still depends on yarn, knit structure, fit and quality review.' },
      { question: 'Can I private label seamless activewear?', answer: 'Yes. Start from selected styles where suitable or discuss a more custom route. Logo, labels, hang tags and packaging should be reviewed with the selected product and order requirements.' },
      { question: 'How should seamless leggings be tested?', answer: 'Test coverage, stretch recovery, waistband stability, fit, knit consistency and high-stretch zones in the intended movements and colorways before bulk approval.' },
      { question: 'What is the MOQ for seamless activewear?', answer: 'Ready-stock qualifying sets start from 50 sets and individual garments from 50 pcs. A more custom seamless development route is quoted according to the knit, colours, size range and branding needs.' },
      { question: 'Can I order a sample first?', answer: 'Yes. Share the style reference, size, colour and requirements so Fitclo can confirm the appropriate sample route before a larger order.' },
    ],
    catalogPath: '/products/matching-sets/',
    catalogLabel: 'Browse Seamless & Matching Styles',
  },
  {
    slug: 'tennis-wear-manufacturer',
    eyebrow: 'TENNIS WEAR & TENNIS SKORT MANUFACTURER',
    title: 'Tennis Wear & Tennis Skort Manufacturer: Private Label Sourcing',
    seoTitle: 'Tennis Wear & Tennis Skort Manufacturer | Private Label Sourcing',
    description: 'Source private label tennis wear, tennis skorts, dresses and coordinated courtwear with Fitclo. Review product options, MOQ, fabrics, fit, samples, branding, quality checks and ready-stock styles.',
    heroTitle: 'Create courtwear that works from the baseline to the product page.',
    heroText: 'For tennis, pickleball and golf-inspired activewear, buyers need to settle silhouette, built-in-short construction, pocket use, movement, coverage, trim and branding before sample approval. Fitclo supports ready-stock and private label sourcing routes.',
    productCodes: ['FLT2134-1', 'TZ2134-2', 'B6505+K6510'],
    fabricNotes: ['Stretch performance fabric directions are selected against the dress, skort, tank or bra construction.', 'For skorts and dresses, review shell fabric and built-in-short fabric as separate functional choices where applicable.', 'Trim, contrast binding and pocket construction should be recorded in the sample brief.'],
    sizeNotes: ['Confirm intended dress, skirt or skort length and the fit of the built-in short.', 'Record waist, hip, rise, inseam, skirt length and top measurements relevant to the silhouette.', 'Test movement, pocket access and coverage on the selected sizes before bulk approval.'],
    decisionRows: [['Courtwear type', 'Tennis dress, tennis skort, skirt set or coordinated separates?', 'Style references, activity and feature priorities.'], ['Built-in-short details', 'Pocket, ball storage, leg opening and coverage requirements?', 'Construction notes and movement test plan.'], ['Fit and trim', 'Which length, contrast binding and top-to-bottom proportions are required?', 'POMs, colour/trim references and grading direction.'], ['Brand presentation', 'How will logo, labels, hang tags and packaging support the collection?', 'Artwork, locations and packaging brief.']],
    qualityChecks: ['Check skirt or dress coverage, built-in-short fit and leg opening during active movement.', 'Test pocket function or ball storage when that feature is specified.', 'Review trim alignment, seams, waistband stability, measurements and logo placement against the approved sample.', 'Confirm the selected colour, size mix and packaging details before final inspection.'],
    faqs: [
      { question: 'Can I private label tennis skorts and tennis dresses?', answer: 'Yes. Buyers can discuss selected styles, logo application, labels, hang tags and packaging. For a more custom route, provide references, functional details, size range and target quantity.' },
      { question: 'What should be checked on a tennis skort sample?', answer: 'Check skirt length, built-in-short coverage, waistband stability, leg opening, seams, pocket function where specified, movement comfort and measurements.' },
      { question: 'What is the MOQ for tennis wear?', answer: 'Ready-stock qualifying sets start from 50 sets and individual garments from 50 pcs. Custom MOQ is confirmed from the style, materials, colours and branding requirements.' },
      { question: 'Can I request a courtwear sample?', answer: 'Yes. Send the reference, selected size, colour and feature requirements such as a pocket or built-in short so the sample route can be confirmed.' },
      { question: 'Are tennis, pickleball and golf styles available?', answer: 'Fitclo offers relevant product directions including dresses, skorts and coordinated sets. Browse the catalog and request a current availability or development discussion for your collection.' },
    ],
    catalogPath: '/products/matching-sets/',
    catalogLabel: 'Browse Tennis & Courtwear Styles',
  },
  {
    slug: 'gym-shorts-manufacturer',
    eyebrow: 'GYM SHORTS MANUFACTURER',
    title: 'Gym Shorts Manufacturer: Private Label Styles, Samples and MOQ',
    seoTitle: 'Gym Shorts Manufacturer | Private Label, Samples & MOQ',
    description: 'Source private label gym shorts with Fitclo. Compare biker, training and running shorts, fabrics, fit, pockets, samples, logos, packaging, quality checks and ready-stock MOQ logic.',
    heroTitle: 'Specify gym shorts for the movement, storage and fit your buyer expects.',
    heroText: 'Gym shorts may look simple, but rise, inseam, waistband, liner, pocket, fabric recovery and print or logo position all influence the final product. Use a focused private label brief before sampling or selecting ready-stock styles.',
    productCodes: ['FC-SHORT-107', 'FC-SHORT-110', 'TZ5529-15'],
    fabricNotes: ['Nylon / spandex directions for fitted biker or studio shorts where smooth stretch and recovery matter.', 'Lightweight performance directions for running or training shorts with liners or pockets.', 'Liner, mesh, elastic and pocket materials should be specified separately when included.'],
    sizeNotes: ['Define the rise, inseam, leg opening and waistband height for the intended wearer and activity.', 'For running shorts, confirm liner fit and storage requirements; for biker shorts, check coverage and recovery during movement.', 'Keep the base size, POMs and grading plan with the approved sample.'],
    decisionRows: [['Short category', 'Biker, running, training or coordinated-set short?', 'Activity, silhouette, length and feature brief.'], ['Functional details', 'Pocket, liner, drawcord, inner short or seam requirements?', 'Construction, storage and movement notes.'], ['Fabric and fit', 'Should the feel be supportive, lightweight, soft or quick-dry?', 'Fabric direction, size plan and sample comments.'], ['Branding and packing', 'Where should the logo and label sit, and how will it be packed?', 'Artwork, placement, hang tag and packaging requirements.']],
    qualityChecks: ['Check waistband stability, inseam and leg opening comfort in the intended movements.', 'Review pocket security or liner construction if included in the product brief.', 'Inspect coverage, recovery, seam quality, measurements, print or logo position and packing against the approved sample.', 'Use the selected colorway in fit checks rather than approving only one dark sample.'],
    faqs: [
      { question: 'What types of gym shorts can I private label?', answer: 'Buyers can discuss fitted biker shorts, running shorts, training shorts and matching-set shorts. The most suitable route depends on activity, fit, fabric, pockets, liner and branding requirements.' },
      { question: 'What is the MOQ for private label gym shorts?', answer: 'Ready-stock individual garments start from 50 pcs in the programme. A custom route is confirmed after the product, material, colour, size range and branding brief are reviewed.' },
      { question: 'Can gym shorts include pockets or liners?', answer: 'Yes, depending on the selected style or custom brief. State the pocket purpose, size, closure and liner requirements so they can be checked on the sample.' },
      { question: 'How do I approve gym shorts before bulk production?', answer: 'Review fit, rise, inseam, waistband, leg opening, fabric behaviour, pocket or liner construction, seams, measurements, branding and packing against the approved sample.' },
      { question: 'Can I request a sample and add my logo?', answer: 'Yes. Send the style reference, color, size, estimated quantity and logo or packaging requirements. Fitclo can confirm the workable sample and branding route.' },
    ],
    catalogPath: '/products/gym-shorts/',
    catalogLabel: 'Browse Gym Shorts',
  },
];

export const getCategorySourcingLandingPage = (slug: string) =>
  categorySourcingLandingPages.find((page) => page.slug === slug);
