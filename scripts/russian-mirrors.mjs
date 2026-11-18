import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, serialize } from 'parse5';

const site = 'https://www.fitcloo.com';
const skipped = new Set(['script', 'style', 'noscript', 'svg', 'code', 'pre', 'template']);
const translatedAttrs = new Set(['alt','aria-label','placeholder','title','data-sending','data-success','data-error','data-no-file']);
const core = { '/': '/ru/', '/products/': '/ru/products/', '/guides/': '/ru/guides/', '/contact/': '/ru/contact/', '/ready-to-ship/': '/ru/ready-stock-activewear/', '/private-label/': '/ru/private-label-activewear/', '/oem-activewear-manufacturer/': '/ru/oem-activewear-manufacturer/', '/wholesale-to/russia/': '/ru/china-activewear-manufacturer-russia/' };
const normalize = path => path.endsWith('/') ? path : path + '/';

export default function russianMirrors({prefix='ru', language='ru', ogLocale='ru_RU', data='ru-mirror.json'} = {}) {
  return { name: 'fitclo-'+prefix+'-mirrors', hooks: { 'astro:build:done': ({dir, logger}) => {
    const output = fileURLToPath(dir);
    const { entries, translations } = JSON.parse(readFileSync(new URL('../src/content/'+data, import.meta.url), 'utf8'));
    const localizedCore = Object.fromEntries(Object.entries(core).filter(([source]) => source !== '/wholesale-to/russia/').map(([source, target]) => [source, target.replace(/^\/ru\//, '/'+prefix+'/')]));
    const targets = { ...(prefix === 'ru' ? core : localizedCore), ...Object.fromEntries(entries.map(source => [source, '/'+prefix+source])) };
    const targetFor = value => {
      if (!value.startsWith('/') && !value.startsWith(site+'/')) return value;
      const url = new URL(value, site);
      const path = targets[normalize(url.pathname)];
      return url.origin === site && path ? (value.startsWith(site) ? site : '') + path + url.search + url.hash : value;
    };
    for (const source of entries) {
      const file = join(output,source.slice(1),'index.html');
      if (!existsSync(file)) throw new Error('Missing Russian mirror source '+source);
      const target = targets[source];
      const canonical = site+target;
      const original = readFileSync(file,'utf8');
      const document = parse(original);
      const alternates = [];
      const whatsapp = (value, sku) => {
        if (!/^https:\/\/(?:api\.whatsapp\.com|wa\.me)\//.test(value)) return value;
        const url = new URL(value);
        if (prefix !== 'ru') return value;
        const previous = url.searchParams.get('text') || '';
        const model = sku || previous.match(/\((?:Style|Model):\s*([^)]{1,60})\)/i)?.[1];
        const subject = model ? `Интересует модель ${model}.` : 'Интересует оптовая закупка спортивной одежды.';
        url.searchParams.set('text', `Здравствуйте, Fitclo! ${subject} Уточните наличие, минимальный заказ и цену.`);
        return url.href;
      };
      const translate = value => value.replace(/^(\s*)([\s\S]*?)(\s*)$/, (_,before,body,after) => before+(Object.hasOwn(translations,body) ? translations[body] : body)+after);
      const localizeSchema = (value, key = '') => {
        if (Array.isArray(value)) return value.map(item => localizeSchema(item, key));
        if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([field,item]) => [field,localizeSchema(item,field)]));
        if (typeof value !== 'string') return value;
        if (key === 'inLanguage') return language;
        if (['name','headline','description','text'].includes(key)) return translate(value);
        if (['@id','url','mainEntityOfPage','item'].includes(key)) return targetFor(value);
        return value;
      };
      function visit(node) {
        if (node.tagName === 'script' && node.attrs?.some(a => a.name === 'type' && a.value === 'application/ld+json')) {
          for (const child of node.childNodes || []) {
            if (child.nodeName === '#text') child.value = JSON.stringify(localizeSchema(JSON.parse(child.value))).replaceAll('<','\\u003c');
          }
        }
        if (skipped.has(node.tagName)) return;
        if (node.nodeName === '#text') node.value = translate(node.value);
        if (node.attrs) {
          const attrs = Object.fromEntries(node.attrs.map(a=>[a.name,a.value]));
          for (const a of node.attrs) {
            if (translatedAttrs.has(a.name)) a.value = translate(a.value);
            if (node.tagName==='html' && a.name==='lang') a.value=language;
            if (node.tagName==='a' && a.name==='href') a.value=whatsapp(targetFor(a.value),attrs['data-wa-product-code']);
            if (a.name==='data-wa-url') a.value=whatsapp(a.value,attrs['data-wa-product-code']);
            if (a.name==='data-language' && node.tagName!=='option') a.value=language;
            if (node.tagName==='link' && attrs.rel==='canonical' && a.name==='href') a.value=canonical;
            if (node.tagName==='link' && attrs.hreflang) alternates.push(node);
            if (node.tagName==='option' && a.name==='value' && attrs['data-language']===language) a.value=target;
            if (node.tagName==='input' && attrs.name==='language' && a.name==='value') a.value=language;
            if (node.tagName==='input' && attrs.name==='page_path' && a.name==='value') a.value=target;
            if (node.tagName==='input' && attrs.name==='page_url' && a.name==='value') a.value=canonical;
            if (node.tagName==='meta' && a.name==='content') {
              if (['og:url','twitter:url'].includes(attrs.property || attrs.name)) a.value=canonical;
              if (attrs.property==='og:locale') a.value=ogLocale;
              if (['description','twitter:title','twitter:description','og:title','og:description'].includes(attrs.property || attrs.name)) a.value=translate(a.value);
            }
          }
          if (node.tagName === 'option' && attrs['data-language']) {
            node.attrs = node.attrs.filter(a => a.name !== 'selected');
            if (attrs['data-language'] === language) node.attrs.push({name:'selected',value:''});
          }
        }
        for (const child of node.childNodes||[]) visit(child);
      }
      visit(document);
      for (const link of new Set(alternates)) {
        link.parentNode.childNodes = link.parentNode.childNodes.filter(node=>node!==link);
      }
      const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;');
      const englishAlternate = `<link rel="alternate" hreflang="en" href="${escape(site+source)}">`;
      const russianAlternate = `<link rel="alternate" hreflang="${language}" href="${escape(canonical)}">`;
      const destination=join(output,target.slice(1),'index.html');
      mkdirSync(dirname(destination),{recursive:true});
      writeFileSync(destination,serialize(document).replace('</head>',englishAlternate+russianAlternate+'</head>'));
      if (!original.includes(`hreflang="${language}"`)) writeFileSync(file,original.replace('</head>',russianAlternate+'</head>'));
    }
    logger.info('Built '+entries.length+' '+prefix+' mirrors');
  } } };
}
