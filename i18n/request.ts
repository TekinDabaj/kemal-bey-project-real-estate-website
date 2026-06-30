import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './config';
import enMessages from '../messages/en.json';

type Messages = { [key: string]: unknown };

// Deep-merge a locale's messages over the English defaults so that any key
// missing from a translation gracefully falls back to English (instead of
// rendering a raw key or, under lang="tr", producing dotted-İ artifacts from
// CSS uppercase on untranslated English text).
function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };
  for (const key of Object.keys(override)) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (
      baseVal &&
      overrideVal &&
      typeof baseVal === 'object' &&
      typeof overrideVal === 'object' &&
      !Array.isArray(baseVal) &&
      !Array.isArray(overrideVal)
    ) {
      result[key] = deepMerge(baseVal as Messages, overrideVal as Messages);
    } else {
      result[key] = overrideVal;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  const localeMessages = (await import(`../messages/${locale}.json`)).default;
  const messages =
    locale === 'en'
      ? localeMessages
      : deepMerge(enMessages as Messages, localeMessages as Messages);

  return {
    locale,
    messages,
  };
});
