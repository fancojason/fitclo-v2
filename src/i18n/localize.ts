export type TranslationPair = readonly [english: string, spanish: string];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const localizeMarkup = (html: string, translations: readonly TranslationPair[]) =>
  translations.reduce((output, [english, spanish]) => {
    const baseVariants = [
      english,
      english.replaceAll('&amp;', '&'),
      english.replaceAll('&amp;', '&').replaceAll('→', '&rarr;'),
    ];
    const renderedVariants = new Set(baseVariants.flatMap((variant) => [
      variant,
      variant.replaceAll("'", '&#39;'),
      variant.replaceAll("'", '&apos;'),
    ]));

    return Array.from(renderedVariants).reduce((localized, variant) => {
      const flexibleText = escapeRegExp(variant).replace(/ +/g, '\\s+');
      const textNode = new RegExp(`(>\\s*)${flexibleText}(\\s*<)`, 'g');
      return localized.replace(textNode, (_match, before: string, after: string) => `${before}${spanish}${after}`);
    }, output);
  }, html);

export const localizeEnglishWhatsAppLinks = (html: string, spanishMessage: string) =>
  html.replace(
    /((?:https:\/\/api\.whatsapp\.com\/send\?phone=8617160837538&(?:amp;)?text=|https:\/\/wa\.me\/8617160837538\?text=))([^"'<\s&]+)/g,
    (match, prefix: string, encodedMessage: string) => {
      try {
        return /^(?:hello|hi)\b/i.test(decodeURIComponent(encodedMessage))
          ? `${prefix}${encodeURIComponent(spanishMessage)}`
          : match;
      } catch {
        return match;
      }
    },
  );
