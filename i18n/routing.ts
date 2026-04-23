import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Supported locales: English (default), Traditional Chinese (Hong Kong), Simplified Chinese
  locales: ["en", "zh-HK", "zh-CN"],

  // Default locale
  defaultLocale: "en",

  // Locale prefix strategy: "always" means all paths will have locale prefix
  // e.g., /en/about, /zh-HK/about, /zh-CN/about
  localePrefix: "always",
});
