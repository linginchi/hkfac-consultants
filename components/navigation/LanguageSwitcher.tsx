"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Language display names for Middle East & Southeast Asian clients
// Clean, intuitive, with native script support
const languageLabels: Record<string, { label: string; native: string; region: string }> = {
  en: { label: "EN", native: "English", region: "Global" },
  "zh-HK": { label: "繁", native: "繁體中文", region: "Hong Kong" },
  "zh-CN": { label: "简", native: "简体中文", region: "Mainland China" },
};

export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  const currentLang = languageLabels[locale] || languageLabels.en;

  return (
    <div className="relative">
      {/* Trigger Button - Clean, prominent in navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-navy-900 hover:text-gold transition-colors rounded-md hover:bg-slate-100"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t("switcher.label")}
      >
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-navy-900 text-slate-50 flex items-center justify-center text-xs font-bold">
            {currentLang.label}
          </span>
          <span className="hidden sm:inline">{currentLang.native}</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for closing */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div
            className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden"
            role="listbox"
            aria-label={t("switcher.label")}
          >
            {routing.locales.map((lang) => {
              const langInfo = languageLabels[lang];
              const isActive = locale === lang;
              
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-navy-50 text-navy-900 border-l-2 border-gold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-navy-900 text-slate-50"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {langInfo.label}
                  </span>
                  <div className="flex flex-col">
                    <span className={isActive ? "font-semibold" : ""}>
                      {t(`switcher.${lang}`)}
                    </span>
                    <span className="text-xs text-slate-400">{langInfo.region}</span>
                  </div>
                  {isActive && (
                    <svg
                      className="w-4 h-4 text-gold ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
