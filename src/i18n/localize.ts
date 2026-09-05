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
