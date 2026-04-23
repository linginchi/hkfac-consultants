"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { TeamMember, getTeamMembers } from "@/lib/team";

// Admin Dashboard Header
function DashboardHeader({ onLogout }: { onLogout: () => void }) {
  const t = useTranslations("adminDashboard");
  const locale = useLocale();

  return (
    <header className="bg-navy-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-gold/30">
              <span className="text-gold font-bold">FAC</span>
            </div>
            <div>
              <span className="text-slate-50 font-semibold">Admin</span>
              <span className="text-xs text-slate-400 block">mark@hkfac.com</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/admin/dashboard"
              locale={locale}
              className="text-sm text-slate-300 hover:text-cyan transition-colors"
            >
              {t("nav.team")}
            </Link>
            <Link
              href="/admin/leads"
              locale={locale}
              className="text-sm text-slate-300 hover:text-cyan transition-colors"
            >
              {t("nav.leads")}
            </Link>
          </nav>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t("logout")}
          </button>
        </div>
      </div>
    </header>
  );
}

// Team Member Management Card
function TeamMemberCard({
  member,
  onEdit,
}: {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
}) {
  const t = useTranslations("adminDashboard");
  const locale = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-cyan/50 transition-colors"
    >
      <div className="flex items-start gap-4">
        {/* Illustration Placeholder */}
        <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
          {member.illustration_url && member.illustration_status === "approved" ? (
            <Image
              src={member.illustration_url}
              alt={member.full_name}
              width={80}
              height={80}
              className="object-cover rounded-lg"
              sizes="80px"
            />
          ) : (
            <div className="text-center">
              <svg className="w-8 h-8 text-slate-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-[10px] text-slate-500 mt-1">{t("noIllustration")}</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-slate-50 truncate">
              {member.full_name}
            </h3>
            {member.member_type === "founder" && (
              <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full">
                {t("founder")}
              </span>
            )}
          </div>
          <p className="text-sm text-cyan mb-2">{member.role[locale as keyof typeof member.role]}</p>
          <p className="text-xs text-slate-400 line-clamp-2">
            {member.bio[locale as keyof typeof member.bio]}
          </p>

          {/* Status Badge */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                member.illustration_status === "approved"
                  ? "bg-green-500/20 text-green-400"
                  : member.illustration_status === "pending"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-slate-600 text-slate-400"
              }`}
            >
              {t(`status.${member.illustration_status}`)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => onEdit(member)}
          className="p-2 text-slate-400 hover:text-cyan transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

// Main Dashboard Page
export default function AdminDashboardPage() {
  const t = useTranslations("adminDashboard");
  const locale = useLocale();
  const router = useRouter();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/admin/check-session");
      if (!response.ok) {
        router.push(`/${locale}/admin/login`);
      }
    };
    checkAuth();
  }, [locale, router]);

  // Load team members
  useEffect(() => {
    async function loadMembers() {
      const result = await getTeamMembers();
      if (result.data) {
        setMembers(result.data);
      }
      setLoading(false);
    }
    loadMembers();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    // TODO: Open edit modal
    alert(`Edit member: ${member.full_name}\n\nFeature coming soon:\n- Update biography\n- Change illustration\n- Edit certifications`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-navy">
        <DashboardHeader onLogout={handleLogout} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-pulse text-slate-400">{t("loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <DashboardHeader onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-50 mb-2">{t("title")}</h1>
          <p className="text-slate-400">{t("subtitle")}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-2xl font-bold text-cyan">{members.length}</p>
            <p className="text-xs text-slate-400">{t("stats.totalMembers")}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-2xl font-bold text-gold">
              {members.filter((m) => m.illustration_status === "approved").length}
            </p>
            <p className="text-xs text-slate-400">{t("stats.approvedIllustrations")}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-2xl font-bold text-yellow-400">
              {members.filter((m) => m.illustration_status === "pending").length}
            </p>
            <p className="text-xs text-slate-400">{t("stats.pendingIllustrations")}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-2xl font-bold text-slate-50">
              {members.reduce((acc, m) => acc + (m.years_experience || 0), 0)}+
            </p>
            <p className="text-xs text-slate-400">{t("stats.totalExperience")}</p>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">{t("section.team")}</h2>
          <button
            onClick={() => alert("Add new member - Coming soon")}
            className="flex items-center gap-2 px-4 py-2 bg-cyan hover:bg-cyan-dark text-navy-900 text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("addMember")}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {members.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={handleEditMember}
            />
          ))}
        </div>

        {/* Illustration Guidelines Card */}
        <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-dashed border-slate-600">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">{t("guidelines.title")}</h3>
              <p className="text-sm text-slate-400 mb-3">{t("guidelines.description")}</p>
              <a
                href="/docs/FAC_Illustration_Style.md"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-cyan hover:text-cyan-light transition-colors"
              >
                {t("guidelines.viewDoc")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
