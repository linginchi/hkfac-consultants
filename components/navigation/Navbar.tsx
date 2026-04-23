import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("navigation");
  const locale = useLocale();

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/insights", label: t("insights") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            locale={locale}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-navy-900 rounded-md flex items-center justify-center">
              <span className="text-gold font-bold text-sm">FAC</span>
            </div>
            <span className="text-navy-900 font-semibold text-lg hidden sm:block">
              FAC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                locale={locale}
                className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section: Language Switcher + CTA */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/contact"
              locale={locale}
              className="hidden sm:inline-flex px-4 py-2 bg-navy-900 text-slate-50 text-sm font-medium rounded-md hover:bg-navy-800 transition-colors"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
