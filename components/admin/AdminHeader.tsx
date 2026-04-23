"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export type AdminNavKey = "dashboard" | "team" | "leads";

export function AdminHeader({
  onLogout,
  active,
}: {
  onLogout: () => void;
  active?: AdminNavKey;
}) {
  const t = useTranslations("adminDashboard");
  const locale = useLocale();

  const cls = (key: AdminNavKey) =>
    `text-sm transition-colors ${
      active === key ? "text-cyan font-medium" : "text-slate-300 hover:text-cyan"
    }`;

  return (
    <header className="bg-navy-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-gold/30">
              <span className="text-gold font-bold">FAC</span>
            </div>
            <div>
              <span className="text-slate-50 font-semibold">Admin</span>
              <span className="text-xs text-slate-400 block">mark@hkfac.com</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin/dashboard" locale={locale} className={cls("dashboard")}>
              {t("nav.overview")}
            </Link>
            <Link href="/admin/team" locale={locale} className={cls("team")}>
              {t("nav.team")}
            </Link>
            <Link href="/admin/leads" locale={locale} className={cls("leads")}>
              {t("nav.leads")}
            </Link>
          </nav>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {t("logout")}
          </button>
        </div>
      </div>
    </header>
  );
}
