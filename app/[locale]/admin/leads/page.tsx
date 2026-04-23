"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLeadsPlaceholderPage() {
  const t = useTranslations("adminLeads");
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const session = await fetch("/api/admin/check-session");
      if (!session.ok) {
        router.push(`/${locale}/admin/login`);
      }
    })();
  }, [locale, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
  };

  return (
    <div className="min-h-screen bg-deep-navy">
      <AdminHeader onLogout={handleLogout} active="leads" />
      <main className="max-w-3xl mx-auto px-4 py-12 text-slate-300">
        <h1 className="text-2xl font-bold text-slate-50 mb-2">{t("title")}</h1>
        <p className="text-slate-400">{t("body")}</p>
      </main>
    </div>
  );
}
