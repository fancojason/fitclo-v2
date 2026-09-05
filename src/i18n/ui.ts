import type { SiteLanguage } from './routes';

const english = {
  nav: {
    home: 'Home', products: 'Products', ready: 'Ready to Ship', privateLabel: 'Private Label',
    manufacturing: 'Manufacturing', about: 'About Us', quote: 'Get a Quote',
    categories: 'ACTIVEWEAR PRODUCT CATEGORIES', viewAll: 'VIEW ALL PRODUCTS →',
  },
  language: { label: 'Language', english: 'English', spanish: 'Español' },
  footer: {
    description: "China's trusted factory-direct manufacturer of premium activewear. Serving 500+ brands worldwide since 2010.",
    subscribe: 'Subscribe for factory updates', resources: 'Resources', categories: 'Top Categories',
    company: 'Company', contact: 'Contact', blog: 'B2B Insights Blog', price: 'Price Guide',
    moq: 'MOQ Guide', certifications: 'Certifications', about: 'About Us', faq: 'FAQ & Support',
    consult: 'Consult Expert', quote: 'Request a Quote', rights: 'ALL RIGHTS RESERVED.',
    support: 'Global Support: 24/7 Available',
  },
  floating: { aria: 'Contact on WhatsApp', tooltip: 'Contact Us', quote: 'Get a Free Quote' },
  whatsappMessage: 'Hello Fitclo, I just viewed your premium activewear collection and would like to discuss a custom project. Can we chat?',
} as const;

const spanish = {
  nav: {
    home: 'Inicio', products: 'Productos', ready: 'Stock disponible', privateLabel: 'Marca privada',
    manufacturing: 'Fabricación', about: 'Sobre nosotros', quote: 'Solicitar cotización',
    categories: 'CATEGORÍAS DE ROPA DEPORTIVA', viewAll: 'VER TODOS LOS PRODUCTOS →',
  },
  language: { label: 'Idioma', english: 'English', spanish: 'Español' },
  footer: {
    description: 'Fabricante directo de fábrica en China de ropa deportiva premium. Atendemos a más de 500 marcas en todo el mundo desde 2010.',
    subscribe: 'Recibe novedades de fábrica', resources: 'Recursos', categories: 'Categorías principales',
    company: 'Empresa', contact: 'Contacto', blog: 'Blog B2B', price: 'Guía de precios',
    moq: 'Guía de MOQ', certifications: 'Certificaciones', about: 'Sobre nosotros', faq: 'Preguntas y soporte',
    consult: 'Consultar a un experto', quote: 'Solicitar cotización', rights: 'TODOS LOS DERECHOS RESERVADOS.',
    support: 'Atención internacional disponible 24/7',
  },
  floating: { aria: 'Contactar por WhatsApp', tooltip: 'Contáctanos', quote: 'Solicitar cotización' },
  whatsappMessage: 'Hola Fitclo, acabo de ver su colección de ropa deportiva premium y quisiera conversar sobre un proyecto personalizado. ¿Podemos hablar?',
} as const;

export const getUi = (language: SiteLanguage) => language === 'es' ? spanish : english;

