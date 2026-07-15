export type ProductCategory = {
  slug: string;
  navLabel: string;
  title: string;
  eyebrow: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  heroAlt: string;
  focus: string;
  styles: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  capabilities: string[];
  fabricNotes: string[];
  faq: Array<{ question: string; answer: string }>;
};

export const productCategories: ProductCategory[] = [
  {
    slug: 'sports-bras',
    navLabel: 'Sports Bras',
    title: 'Custom Sports Bras',
    eyebrow: 'SPORTS BRA MANUFACTURING',
    description:
      'Develop supportive, brand-right sports bras with Fitclo. From seamless studio bras to engineered high-impact styles, we help activewear brands balance fit, support, fabric hand feel and a distinctive visual identity.',
    shortDescription: 'Seamless, longline and high-support bra development for private label collections.',
    heroImage: '/images/product-categories/sports-bras-hero.png',
    heroAlt: 'Female athlete wearing a supportive black sports bra in a premium activewear studio',
    focus: 'Support architecture, bra fit, cup options and sweat-ready performance fabrics.',
    styles: [
      { id: 'seamless', name: 'Seamless Sports Bras', description: 'Circular-knit bras with clean shaping zones, rib support and a low-bulk finish for studio-to-street collections.' },
      { id: 'longline', name: 'Longline & Crop Bras', description: 'Extended underbands and fashion-led necklines that pair easily with leggings, shorts and matching sets.' },
      { id: 'high-support', name: 'High-Support Sports Bras', description: 'Structured designs with reinforced underbands, targeted compression and adjustable support details for training and running.' },
    ],
    capabilities: ['Removable or fixed cup options', 'Racerback, cross-back and adjustable strap constructions', 'Custom jacquard bands, labels and heat-transfer logos'],
    fabricNotes: ['Nylon-spandex for a soft, premium hand feel', 'Polyester-spandex for durable colour and print performance', 'Mesh zoning and power mesh for targeted ventilation'],
    faq: [
      { question: 'Can you develop a sports bra from a reference image?', answer: 'Yes. Share the reference, target activity, desired support level and estimated quantity. Our team can advise on the right construction and sampling path.' },
      { question: 'How do you choose the support level?', answer: 'We assess the intended movement, bra structure, fabric weight, underband tension and strap design rather than relying on a style name alone.' },
    ],
  },
  {
    slug: 'gym-shorts',
    navLabel: 'Gym Shorts',
    title: 'Custom Gym Shorts',
    eyebrow: 'GYM SHORTS MANUFACTURING',
    description:
      'Build gym shorts that move cleanly, retain their shape and fit the purpose of your collection. Fitclo develops women’s training shorts, men’s gym shorts, biker shorts and performance styles for private label and OEM programs.',
    shortDescription: 'Women’s, men’s, biker and lined performance shorts for gym and training brands.',
    heroImage: '/images/product-categories/gym-shorts-hero.png',
    heroAlt: 'Activewear gym shorts displayed in a contemporary fitness apparel production studio',
    focus: 'Waistband stability, inseam choices, liners, pockets and workout-ready recovery.',
    styles: [
      { id: 'womens', name: 'Women’s Gym Shorts', description: 'High-rise, scrunch, running and training shorts shaped for confident movement and a flattering brand silhouette.' },
      { id: 'mens', name: 'Men’s Gym Shorts', description: 'Training, lifestyle and performance shorts with considered inseams, drawcords and functional pocket layouts.' },
      { id: 'biker', name: 'Biker & Compression Shorts', description: 'Close-fit shorts with squat-proof coverage, secure waistbands and optional contour or seamless knit details.' },
    ],
    capabilities: ['Double-layer or built-in liner options', 'Zipper, side or hidden waistband pockets', 'Custom drawcords, reflective details and branded trims'],
    fabricNotes: ['Interlock fabrics for opaque compression shorts', 'Lightweight woven fabrics for running and men’s training shorts', 'Nylon-spandex blends for soft, sculpting biker shorts'],
    faq: [
      { question: 'Can Fitclo make both women’s and men’s shorts?', answer: 'Yes. We can develop separate fit blocks, inseams and fabric directions for women’s and men’s categories in one collection.' },
      { question: 'What should I decide before sampling gym shorts?', answer: 'Choose the use case, intended inseam, lining requirement, pocket position, fabric weight, colour direction and brand application.' },
    ],
  },
  {
    slug: 'training-pants',
    navLabel: 'Training Pants',
    title: 'Custom Training Pants',
    eyebrow: 'SPORTS PANTS MANUFACTURING',
    description:
      'Fitclo produces training pants that work beyond the gym floor: tapered performance pants, joggers, straight-leg studio styles and technical warm-up layers. We align fit, mobility, fabric durability and trim details with your target market.',
    shortDescription: 'Tapered, straight-leg and jogger-style training pants for women’s and men’s collections.',
    heroImage: '/images/product-categories/training-pants-hero.png',
    heroAlt: 'Athlete wearing tailored black training pants in a modern activewear studio',
    focus: 'Mobility, abrasion resistance, pocket engineering and polished athleisure fit.',
    styles: [
      { id: 'womens', name: 'Women’s Training Pants', description: 'Flare, straight-leg and relaxed technical pants with movement-led grading and a clean studio finish.' },
      { id: 'mens', name: 'Men’s Training Pants', description: 'Tapered joggers and warm-up pants engineered around training movement, secure pockets and everyday wear.' },
      { id: 'performance', name: 'Performance Joggers', description: 'Lightweight, structured or brushed options for travel, warm-up and post-workout product stories.' },
    ],
    capabilities: ['Tapered, cuffed, straight and flared silhouettes', 'Elastic waistbands with drawcord or flat-front finishes', 'Zipper pockets, panel seams and contrast piping'],
    fabricNotes: ['Four-way stretch double-knit for technical structure', 'Woven nylon blends for lightweight performance', 'Brushed fabrics for cooler-weather collections'],
    faq: [
      { question: 'Are training pants suitable for both gym and lifestyle wear?', answer: 'Yes. The construction can be tuned toward technical training, premium athleisure or a balanced hybrid through fabric, fit and pocket selection.' },
      { question: 'Can you match a pant to an existing top collection?', answer: 'Yes. We can align colour, fabric hand feel, logo method and styling cues across a broader capsule.' },
    ],
  },
  {
    slug: 'leggings',
    navLabel: 'Leggings',
    title: 'Custom Activewear Leggings',
    eyebrow: 'LEGGINGS MANUFACTURING',
    description:
      'Leggings are a fit-sensitive category, not a generic commodity. Fitclo helps brands develop high-rise, seamless, panelled, flare and performance leggings with dependable opacity, recovery and waistband comfort.',
    shortDescription: 'Seamless, cut-and-sew, flare and sculpting leggings for yoga, gym and athleisure lines.',
    heroImage: '/images/product-categories/leggings-hero.png',
    heroAlt: 'Female athlete wearing high-waisted charcoal activewear leggings in a studio setting',
    focus: 'Squat-proof coverage, waistband recovery, panel placement and size-consistent fit.',
    styles: [
      { id: 'seamless', name: 'Seamless Leggings', description: 'Circular-knit leggings with engineered rib zones, contour shading and low-friction comfort for seamless collections.' },
      { id: 'cut-sew', name: 'Cut-and-Sew Leggings', description: 'Panelled leggings that offer broader fabric, print, pocket and construction choices for a custom product identity.' },
      { id: 'flare', name: 'Flare & Studio Leggings', description: 'Flared, crossover-waist and studio-led silhouettes designed for modern yoga and athleisure assortments.' },
    ],
    capabilities: ['High-rise, crossover and V-waist designs', 'Side pockets, contour panels and flatlock seams', 'Custom colourways, prints and logo placements'],
    fabricNotes: ['Nylon-spandex for soft compression and premium hand feel', 'Polyester-spandex for print clarity and durability', 'Seamless yarn programs for body-mapped shaping'],
    faq: [
      { question: 'How do you reduce the risk of leggings becoming see-through?', answer: 'We assess fabric weight, stretch direction, colour, garment tension and size grading before bulk production, then confirm the approved standard through sampling and inspection.' },
      { question: 'What is the difference between seamless and cut-and-sew leggings?', answer: 'Seamless styles are knit close to shape with engineered zones. Cut-and-sew leggings use cut fabric panels, enabling more construction, print and pocket options.' },
    ],
  },
  {
    slug: 't-shirts',
    navLabel: 'T-Shirts',
    title: 'Custom Training T-Shirts',
    eyebrow: 'ACTIVEWEAR T-SHIRT MANUFACTURING',
    description:
      'Develop essential training tees with the fit, fabric and finishing standards your customers notice. Fitclo makes women’s fitted tops, men’s performance T-shirts and unisex cotton styles for gym, running and lifestyle collections.',
    shortDescription: 'Women’s fitted tops, men’s performance tees and unisex cotton activewear T-shirts.',
    heroImage: '/images/product-categories/t-shirts-hero.png',
    heroAlt: 'Performance training T-shirts in muted colours arranged in an activewear design studio',
    focus: 'Fit blocks, neckline shape, fabric drape and technical seam placement.',
    styles: [
      { id: 'unisex', name: 'Unisex Cotton T-Shirts', description: 'Soft, durable cotton or cotton-blend tees for brand merchandise, studio uniforms and elevated casual collections.' },
      { id: 'mens', name: 'Men’s Performance T-Shirts', description: 'Moisture-managing training tees with ergonomic seams, lightweight fabrics and room to move.' },
      { id: 'womens', name: 'Women’s Training T-Shirts', description: 'Fitted, cropped and relaxed women’s tops with neckline and length options built around the intended activity.' },
    ],
    capabilities: ['Raglan, set-in sleeve and drop-shoulder patterns', 'Crew, mock-neck and scoop-neck options', 'Heat-transfer, embroidery and woven-label branding'],
    fabricNotes: ['Polyester performance jersey for quick drying', 'Nylon blends for a softer technical hand feel', 'Cotton blends for premium casual and studio basics'],
    faq: [
      { question: 'Can you make a tee that feels technical but not overly synthetic?', answer: 'Yes. We can review nylon blends, soft polyester yarns and cotton-performance blends according to your desired hand feel and use case.' },
      { question: 'Do you offer men’s and women’s fit blocks?', answer: 'Yes. We can use separate fit directions and size grading rather than simply resizing one pattern.' },
    ],
  },
  {
    slug: 'tank-tops',
    navLabel: 'Tank Tops',
    title: 'Custom Tank Tops & Stringers',
    eyebrow: 'TANK TOP MANUFACTURING',
    description:
      'Create breathable training layers with Fitclo: women’s fitted tanks, men’s stringers, racerback styles and relaxed workout tops. We help make the proportions, armholes and fabric weight feel intentional on-body.',
    shortDescription: 'Women’s tanks, men’s stringers and breathable training tops with custom branding.',
    heroImage: '/images/product-categories/tank-tops-hero.png',
    heroAlt: 'Athletes wearing neutral performance tank tops in a premium gym apparel studio',
    focus: 'Armhole comfort, breathability, proportion and layering compatibility.',
    styles: [
      { id: 'womens', name: 'Women’s Tank Tops', description: 'Fitted, cropped and open-back tanks designed for studio, gym and layered lifestyle outfits.' },
      { id: 'mens', name: 'Men’s Tank Tops & Stringers', description: 'Training tanks and stringers with considered armhole depth, lightweight fabrics and a clean branded finish.' },
      { id: 'racerback', name: 'Racerback Training Tops', description: 'Versatile performance tops that provide shoulder mobility and pair easily with bras, shorts and leggings.' },
    ],
    capabilities: ['Fitted, relaxed, crop and longline body lengths', 'Mesh inserts, open-back and laser-cut ventilation options', 'Bound edges, contrast trims and custom logo applications'],
    fabricNotes: ['Lightweight jersey for breathable training tops', 'Fine rib for elevated studio tanks', 'Mesh and perforated fabrics for ventilation zones'],
    faq: [
      { question: 'Can a tank top be made as part of a matching collection?', answer: 'Yes. We can develop the colour, branding and fabric direction alongside shorts, leggings, bras or jackets.' },
      { question: 'What makes a good gym stringer fit?', answer: 'The key decisions are armhole shape, body length, fabric drape, neckline and how much stretch recovery the fabric provides.' },
    ],
  },
  {
    slug: 'matching-sets',
    navLabel: 'Matching Sets',
    title: 'Custom Activewear Sets',
    eyebrow: 'SPORTS SET MANUFACTURING',
    description:
      'Coordinate products into high-conversion activewear sets. Fitclo develops women’s yoga sets and men’s training sets with aligned fit, colour, branding and material performance across every piece.',
    shortDescription: 'Women’s yoga sets and men’s training sets developed as coordinated product capsules.',
    heroImage: '/images/product-categories/matching-sets-hero.png',
    heroAlt: 'Female athlete wearing a coordinated olive activewear matching set in a studio',
    focus: 'Colour consistency, coordinated sizing, collection-level storytelling and bundle-ready merchandising.',
    styles: [
      { id: 'yoga', name: 'Women’s Yoga Sets', description: 'Bra-and-legging, bra-and-short and studio set combinations with harmonious fabrics and an intentional silhouette.' },
      { id: 'mens', name: 'Men’s Training Sets', description: 'T-shirt-and-short, tank-and-jogger and warm-up set programs designed for practical training wardrobes.' },
      { id: 'three-piece', name: 'Three-Piece Performance Sets', description: 'Layered bra, legging and jacket capsules for elevated seasonal drops and private label launches.' },
    ],
    capabilities: ['Matched dye lots and colour approvals', 'Set-level packaging and branded inserts', 'Coordinated MOQ planning across multiple styles'],
    fabricNotes: ['Nylon-spandex sets for a premium studio story', 'Seamless sets for compact, sculpted collections', 'Performance jersey and woven pairings for men’s training sets'],
    faq: [
      { question: 'Can I order a set with different sizes for top and bottom?', answer: 'For retail programs, separate SKUs are usually the most flexible approach. We can advise on packing and MOQ planning for the two pieces.' },
      { question: 'How do you keep colours consistent across a set?', answer: 'We confirm colour standards during development and manage bulk fabric approvals so the selected pieces are aligned before sewing begins.' },
    ],
  },
  {
    slug: 'jumpsuits',
    navLabel: 'Jumpsuits',
    title: 'Custom Activewear Jumpsuits',
    eyebrow: 'JUMPSUIT MANUFACTURING',
    description:
      'Bring a one-piece statement to your activewear line with custom jumpsuits and bodysuits. Fitclo supports the technical details that matter most: torso length, fabric recovery, neckline support and comfort in movement.',
    shortDescription: 'One-piece yoga jumpsuits and bodysuits built around fit, support and premium fabric recovery.',
    heroImage: '/images/product-categories/jumpsuits-hero.png',
    heroAlt: 'Female athlete wearing a sleek black activewear jumpsuit in a bright studio',
    focus: 'Torso grading, body-contouring construction, bra support and all-day comfort.',
    styles: [
      { id: 'full-length', name: 'Full-Length Yoga Jumpsuits', description: 'Long-leg one-pieces with supportive bodies, clean lines and optional flare or compression silhouettes.' },
      { id: 'short', name: 'Short Jumpsuits', description: 'Summer-ready one-pieces and unitards that combine secure coverage with a compact, fashion-led profile.' },
      { id: 'bodysuit', name: 'Studio Bodysuits', description: 'Layering-friendly bodysuits in premium rib, seamless or cut-and-sew fabric directions.' },
    ],
    capabilities: ['Open-back, cross-back and high-neck variations', 'Built-in shelf bras and removable cups', 'Contouring seams, flare legs and custom length options'],
    fabricNotes: ['Nylon-spandex for sculpting recovery and a soft hand feel', 'Seamless knit for body-mapped support', 'Fine rib textures for a studio-to-street aesthetic'],
    faq: [
      { question: 'Why is jumpsuit sizing more complex than leggings?', answer: 'A jumpsuit joins the torso, chest, waist and leg fit in one garment, so body length and stretch recovery must be validated carefully in samples.' },
      { question: 'Can you add bra support to a jumpsuit?', answer: 'Yes. Depending on the design, we can discuss shelf-bra construction, removable cups, lining and support zones.' },
    ],
  },
  {
    slug: 'jackets',
    navLabel: 'Jackets',
    title: 'Custom Activewear Jackets',
    eyebrow: 'SPORTS JACKET MANUFACTURING',
    description:
      'Finish a performance collection with jackets and outer layers that look as good on the rail as they work during a warm-up. Fitclo develops women’s fitted jackets, men’s training jackets and versatile technical layers.',
    shortDescription: 'Women’s fitted jackets, men’s training layers and technical outerwear for activewear brands.',
    heroImage: '/images/product-categories/jackets-hero.png',
    heroAlt: 'Athlete wearing a tailored activewear jacket in a modern apparel studio',
    focus: 'Layering, zipper and pocket quality, functional warmth and a clean retail-ready finish.',
    styles: [
      { id: 'womens', name: 'Women’s Activewear Jackets', description: 'Fitted zip jackets, cropped layers and thumbhole styles that complete leggings and studio-set collections.' },
      { id: 'mens', name: 'Men’s Training Jackets', description: 'Technical warm-up jackets and lightweight layers with practical fit, pockets and durable fabric choices.' },
      { id: 'outerwear', name: 'Technical Outer Layers', description: 'Windbreakers, light shells and transitional pieces for outdoor training and seasonal product drops.' },
    ],
    capabilities: ['Full zip, half zip and pullover constructions', 'Thumbholes, stand collars and shaped cuffs', 'Zipper pockets, mesh linings and custom hardware'],
    fabricNotes: ['Stretch double-knit for fitted training jackets', 'Lightweight woven fabrics for windbreakers', 'Brushed-back fabrics for cooler studio layers'],
    faq: [
      { question: 'Can you source custom zipper pulls and branded hardware?', answer: 'Yes. We can discuss zipper quality, puller shape, finish and custom brand applications as part of the trim package.' },
      { question: 'What is the best jacket fabric for a gym collection?', answer: 'It depends on whether the jacket is for warm-up, outdoor protection or lifestyle layering. We select fabric based on the desired stretch, warmth, weight and surface finish.' },
    ],
  },
];

export const getProductCategory = (slug: string) =>
  productCategories.find((category) => category.slug === slug);
