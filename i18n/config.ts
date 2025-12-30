export const locales = ['en', 'tr', 'ms', 'id', 'es', 'pt', 'de', 'fr', 'it', 'zh', 'ja', 'hi'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
  ms: 'Melayu',
  id: 'Bahasa Indonesia',
  es: 'Español',
  pt: 'Português',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  zh: '中文',
  ja: '日本語',
  hi: 'हिन्दी',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  tr: '🇹🇷',
  ms: '🇸🇬',
  id: '🇮🇩',
  es: '🇪🇸',
  pt: '🇵🇹',
  de: '🇩🇪',
  fr: '🇫🇷',
  it: '🇮🇹',
  zh: '🇨🇳',
  ja: '🇯🇵',
  hi: '🇮🇳',
};
