"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { TeamMemberType } from "@/lib/team";

type DbTeamMember = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  linkedin_url: string | null;
  role_en: string;
  role_zh_hk: string | null;
  role_zh_cn: string | null;
  expertise_areas: string[] | null;
  bio_en: string | null;
  bio_zh_hk: string | null;
  bio_zh_cn: string | null;
  description_en: string | null;
  description_zh_hk: string | null;
  description_zh_cn: string | null;
  value_prop_en: string | null;
  value_prop_zh_hk: string | null;
  value_prop_zh_cn: string | null;
  illustration_url: string | null;
  illustration_status: string | null;
  member_type: string;
  is_active: boolean;
  display_order: number | null;
  certifications: string[] | null;
  awards: string[] | null;
  education: string[] | null;
  years_experience: number | null;
  joined_fac_date: string | null;
  client_regions: string[] | null;
};

function rowToForm(r: DbTeamMember | null): Record<string, string | boolean | number> {
  if (!r) {
    return {
      first_name: "",
      last_name: "",
      email: "",
      linkedin_url: "",
      role_en: "",
      role_zh_hk: "",
      role_zh_cn: "",
      expertise_areas: "",
      bio_en: "",
      bio_zh_hk: "",
      bio_zh_cn: "",
      description_en: "",
      description_zh_hk: "",
      description_zh_cn: "",
      value_prop_en: "",
      value_prop_zh_hk: "",
      value_prop_zh_cn: "",
      illustration_url: "",
      illustration_status: "pending",
      member_type: "advisor",
      is_active: true,
      display_order: 0,
      certifications: "",
      awards: "",
      education: "",
      years_experience: 0,
      joined_fac_date: "",
      client_regions: "",
    };
  }
  return {
    first_name: r.first_name || "",
    last_name: r.last_name || "",
    email: r.email || "",
    linkedin_url: r.linkedin_url || "",
    role_en: r.role_en || "",
    role_zh_hk: r.role_zh_hk || "",
    role_zh_cn: r.role_zh_cn || "",
    expertise_areas: (r.expertise_areas || []).join(", "),
    bio_en: r.bio_en || "",
    bio_zh_hk: r.bio_zh_hk || "",
    bio_zh_cn: r.bio_zh_cn || "",
    description_en: r.description_en || "",
    description_zh_hk: r.description_zh_hk || "",
    description_zh_cn: r.description_zh_cn || "",
    value_prop_en: r.value_prop_en || "",
    value_prop_zh_hk: r.value_prop_zh_hk || "",
    value_prop_zh_cn: r.value_prop_zh_cn || "",
    illustration_url: r.illustration_url || "",
    illustration_status: r.illustration_status || "pending",
    member_type: r.member_type || "advisor",
    is_active: r.is_active !== false,
    display_order: r.display_order ?? 0,
    certifications: (r.certifications || []).join(", "),
    awards: (r.awards || []).join(", "),
    education: (r.education || []).join(", "),
    years_experience: r.years_experience ?? 0,
    joined_fac_date: r.joined_fac_date || "",
    client_regions: (r.client_regions || []).join(", "),
  };
}

function AdminTeamPageContent() {
  const t = useTranslations("adminTeam");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rows, setRows] = useState<DbTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean | number>>(() => rowToForm(null));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin/team?all=1");
    if (!res.ok) {
      if (res.status === 401) {
        router.push(`/${locale}/admin/login`);
        return;
      }
      setError(t("errors.loadFailed"));
      setLoading(false);
      return;
    }
    const json = await res.json();
    setRows(json.data || []);
    setLoading(false);
  }, [locale, router, t]);

  useEffect(() => {
    (async () => {
      const session = await fetch("/api/admin/check-session");
      if (!session.ok) {
        router.push(`/${locale}/admin/login`);
        return;
      }
      await load();
    })();
  }, [locale, router, load]);

  useEffect(() => {
    const id = searchParams.get("edit");
    if (!id || rows.length === 0) return;
    const row = rows.find((r) => r.id === id);
    if (row) {
      setEditingId(row.id);
      setForm(rowToForm(row));
      setModalOpen(true);
      router.replace(`/${locale}/admin/team`, { scroll: false });
    }
  }, [searchParams, rows, locale, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(rowToForm(null));
    setModalOpen(true);
  };

  const openEdit = (r: DbTeamMember) => {
    setEditingId(r.id);
    setForm(rowToForm(r));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (key: string, value: string | boolean | number) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const buildPayload = () => ({
    first_name: form.first_name,
    last_name: form.last_name,
    email: form.email || null,
    linkedin_url: form.linkedin_url || null,
    role_en: form.role_en,
    role_zh_hk: form.role_zh_hk,
    role_zh_cn: form.role_zh_cn,
    expertise_areas: form.expertise_areas,
    bio_en: form.bio_en,
    bio_zh_hk: form.bio_zh_hk,
    bio_zh_cn: form.bio_zh_cn,
    description_en: form.description_en || null,
    description_zh_hk: form.description_zh_hk || null,
    description_zh_cn: form.description_zh_cn || null,
    value_prop_en: form.value_prop_en,
    value_prop_zh_hk: form.value_prop_zh_hk,
    value_prop_zh_cn: form.value_prop_zh_cn,
    illustration_url: form.illustration_url || null,
    illustration_status: form.illustration_status,
    member_type: form.member_type,
    is_active: form.is_active,
    display_order: Number(form.display_order) || 0,
    certifications: form.certifications,
    awards: form.awards,
    education: form.education,
    years_experience: Number(form.years_experience) || 0,
    joined_fac_date: form.joined_fac_date || null,
    client_regions: form.client_regions,
  });

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = buildPayload();
      const url = editingId ? `/api/admin/team/${editingId}` : "/api/admin/team";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("errors.saveFailed"));
        setSaving(false);
        return;
      }
      closeModal();
      setLoading(true);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(t("confirmDelete", { name }))) return;
    const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t("errors.deleteFailed"));
      return;
    }
    setLoading(true);
    await load();
  };

  const inputCls =
    "w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan";

  if (loading && rows.length === 0) {
    return (
      <div className="min-h-screen bg-deep-navy">
        <AdminHeader onLogout={handleLogout} active="team" />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p className="text-slate-400">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <AdminHeader onLogout={handleLogout} active="team" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">{t("title")}</h1>
            <p className="text-slate-400 text-sm mt-1">{t("subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan hover:bg-cyan-dark text-navy-900 text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("addMember")}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="px-4 py-3 font-medium">{t("table.name")}</th>
                <th className="px-4 py-3 font-medium">{t("table.type")}</th>
                <th className="px-4 py-3 font-medium">{t("table.roleEn")}</th>
                <th className="px-4 py-3 font-medium">{t("table.order")}</th>
                <th className="px-4 py-3 font-medium">{t("table.active")}</th>
                <th className="px-4 py-3 font-medium w-32">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-700/80 hover:bg-slate-800/80">
                  <td className="px-4 py-3 text-slate-100">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-4 py-3 text-slate-300 capitalize">{r.member_type}</td>
                  <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate">{r.role_en}</td>
                  <td className="px-4 py-3 text-slate-300">{r.display_order ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        r.is_active
                          ? "text-emerald-400 text-xs font-medium"
                          : "text-slate-500 text-xs"
                      }
                    >
                      {r.is_active ? t("active.yes") : t("active.no")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="text-cyan hover:text-cyan-light text-xs font-medium"
                      >
                        {t("edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(r.id, `${r.first_name} ${r.last_name}`)}
                        className="text-red-400 hover:text-red-300 text-xs font-medium"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    {t("empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-600 rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-slate-50">
                {editingId ? t("modal.editTitle") : t("modal.createTitle")}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-200 rounded-lg"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto px-4 py-4 space-y-6 flex-1">
              <section>
                <h3 className="text-xs font-semibold text-cyan uppercase tracking-wider mb-3">{t("sections.basic")}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.firstName")}</label>
                    <input
                      className={inputCls}
                      value={String(form.first_name)}
                      onChange={(e) => handleChange("first_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.lastName")}</label>
                    <input
                      className={inputCls}
                      value={String(form.last_name)}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.email")}</label>
                    <input
                      className={inputCls}
                      type="email"
                      value={String(form.email)}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.linkedin")}</label>
                    <input
                      className={inputCls}
                      value={String(form.linkedin_url)}
                      onChange={(e) => handleChange("linkedin_url", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-cyan uppercase tracking-wider mb-3">{t("sections.roles")}</h3>
                <div className="grid gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.roleEn")}</label>
                    <input
                      className={inputCls}
                      value={String(form.role_en)}
                      onChange={(e) => handleChange("role_en", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.roleZhHk")}</label>
                    <input
                      className={inputCls}
                      value={String(form.role_zh_hk)}
                      onChange={(e) => handleChange("role_zh_hk", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.roleZhCn")}</label>
                    <input
                      className={inputCls}
                      value={String(form.role_zh_cn)}
                      onChange={(e) => handleChange("role_zh_cn", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-cyan uppercase tracking-wider mb-3">{t("sections.bio")}</h3>
                <div className="grid gap-3">
                  {(["bio_en", "bio_zh_hk", "bio_zh_cn"] as const).map((key) => (
                    <div key={key}>
                      <label className="block text-xs text-slate-400 mb-1">
                        {t(`fields.${key}`)} ({String(form[key] || "").length}/200)
                      </label>
                      <textarea
                        className={`${inputCls} min-h-[72px]`}
                        maxLength={200}
                        value={String(form[key] || "")}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-cyan uppercase tracking-wider mb-3">{t("sections.valueProp")}</h3>
                <div className="grid gap-3">
                  {(["value_prop_en", "value_prop_zh_hk", "value_prop_zh_cn"] as const).map((key) => (
                    <div key={key}>
                      <label className="block text-xs text-slate-400 mb-1">
                        {t(`fields.${key}`)} ({String(form[key] || "").length}/150)
                      </label>
                      <textarea
                        className={`${inputCls} min-h-[60px]`}
                        maxLength={150}
                        value={String(form[key] || "")}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-cyan uppercase tracking-wider mb-3">{t("sections.optional")}</h3>
                <div className="grid gap-3">
                  {(["description_en", "description_zh_hk", "description_zh_cn"] as const).map((key) => (
                    <div key={key}>
                      <label className="block text-xs text-slate-400 mb-1">{t(`fields.${key}`)}</label>
                      <textarea
                        className={`${inputCls} min-h-[56px]`}
                        value={String(form[key] || "")}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-cyan uppercase tracking-wider mb-3">{t("sections.illustration")}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.illustrationUrl")}</label>
                    <input
                      className={inputCls}
                      value={String(form.illustration_url)}
                      onChange={(e) => handleChange("illustration_url", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.illustrationStatus")}</label>
                    <select
                      className={inputCls}
                      value={String(form.illustration_status)}
                      onChange={(e) => handleChange("illustration_status", e.target.value)}
                    >
                      <option value="pending">pending</option>
                      <option value="generated">generated</option>
                      <option value="approved">approved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.memberType")}</label>
                    <select
                      className={inputCls}
                      value={String(form.member_type)}
                      onChange={(e) => handleChange("member_type", e.target.value as TeamMemberType)}
                    >
                      <option value="founder">founder</option>
                      <option value="partner">partner</option>
                      <option value="advisor">advisor</option>
                      <option value="associate">associate</option>
                    </select>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-cyan uppercase tracking-wider mb-3">{t("sections.meta")}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.displayOrder")}</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={Number(form.display_order)}
                      onChange={(e) => handleChange("display_order", parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.yearsExperience")}</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={Number(form.years_experience)}
                      onChange={(e) => handleChange("years_experience", parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.joinedFacDate")}</label>
                    <input
                      type="date"
                      className={inputCls}
                      value={String(form.joined_fac_date || "")}
                      onChange={(e) => handleChange("joined_fac_date", e.target.value)}
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(form.is_active)}
                        onChange={(e) => handleChange("is_active", e.target.checked)}
                        className="rounded border-slate-500 text-cyan focus:ring-cyan"
                      />
                      {t("fields.isActive")}
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.expertiseAreas")}</label>
                    <input
                      className={inputCls}
                      placeholder={t("placeholders.commaSeparated")}
                      value={String(form.expertise_areas)}
                      onChange={(e) => handleChange("expertise_areas", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.certifications")}</label>
                    <input
                      className={inputCls}
                      value={String(form.certifications)}
                      onChange={(e) => handleChange("certifications", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.awards")}</label>
                    <input
                      className={inputCls}
                      value={String(form.awards)}
                      onChange={(e) => handleChange("awards", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.education")}</label>
                    <input
                      className={inputCls}
                      value={String(form.education)}
                      onChange={(e) => handleChange("education", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">{t("fields.clientRegions")}</label>
                    <input
                      className={inputCls}
                      value={String(form.client_regions)}
                      onChange={(e) => handleChange("client_regions", e.target.value)}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="flex justify-end gap-3 px-4 py-3 border-t border-slate-700 bg-slate-900/95">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm text-slate-300 hover:text-slate-100 rounded-lg border border-slate-600"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={save}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-cyan text-navy-900 hover:bg-cyan-dark disabled:opacity-50"
              >
                {saving ? t("saving") : t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminTeamPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-deep-navy flex items-center justify-center text-slate-400 text-sm">
          Loading…
        </div>
      }
    >
      <AdminTeamPageContent />
    </Suspense>
  );
}
