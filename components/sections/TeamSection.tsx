"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  getTeamMembers,
  TeamMember,
  getLocalizedContent,
  getMemberTypeLabel,
  EXPERTISE_DISPLAY_NAMES,
} from "@/lib/team";

// Member Card Component
function MemberCard({
  member,
  isFounder = false,
}: {
  member: TeamMember;
  isFounder?: boolean;
}) {
  const t = useTranslations("team");
  const locale = useLocale();
  const [isExpanded, setIsExpanded] = useState(false);

  const role = getLocalizedContent(member.role, locale);
  const bio = getLocalizedContent(member.bio, locale);
  const valueProp = getLocalizedContent(member.value_prop, locale);
  const memberTypeLabel = getMemberTypeLabel(member.member_type, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isFounder
          ? "border-gold shadow-lg hover:shadow-xl"
          : "border-slate-200 hover:border-cyan/50 hover:shadow-md"
      }`}
    >
      {/* Card Header - Illustration Area */}
      <div
        className={`relative ${
          isFounder ? "h-80" : "h-64"
        } bg-slate-50 flex items-center justify-center overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#0F172A" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Illustration or Placeholder */}
        {member.illustration_url && member.illustration_status === "approved" ? (
          <Image
            src={member.illustration_url}
            alt={member.full_name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 480px"
            priority={isFounder}
          />
        ) : (
          <div className="text-center p-6">
            {/* Placeholder Icon */}
            <div
              className={`mx-auto mb-4 rounded-full flex items-center justify-center ${
                isFounder ? "w-32 h-32 bg-gold/10" : "w-24 h-24 bg-cyan/10"
              }`}
            >
              <svg
                className={`w-16 h-16 ${isFounder ? "text-gold/40" : "text-cyan/40"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            {/* Placeholder Text */}
            <div className="bg-navy-900/5 rounded-lg px-4 py-2">
              <p className="text-xs font-medium text-navy-900">
                [AI-Generated Illustration - FAC Style]
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Deep Navy (#0F172A) geometric portrait
              </p>
              <p className="text-xs text-slate-500">
                Cyan (#06B6D4) accent highlights
              </p>
              <p className="text-xs text-slate-500">
                Minimalist line art style
              </p>
            </div>
          </div>
        )}

        {/* Member Type Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
            isFounder
              ? "bg-gold text-navy-900"
              : "bg-navy-900 text-slate-50"
          }`}
        >
          {memberTypeLabel}
        </div>

        {/* Experience Badge (for founder) */}
        {isFounder && (
          <div className="absolute bottom-4 right-4 bg-gold/90 text-navy-900 px-3 py-1.5 rounded-lg text-xs font-bold">
            {member.years_experience} {t("yearsExperience")}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Name & Role */}
        <h3 className="text-xl font-bold text-navy-900 mb-1">
          {member.full_name}
        </h3>
        <p className="text-sm font-medium text-cyan mb-3">{role}</p>

        {/* Bio - Max 200 chars */}
        <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
          {bio}
        </p>

        {/* Value Proposition - Highlight for ME/SEA clients */}
        <div className="bg-cyan/5 border-l-2 border-cyan rounded-r-lg p-3 mb-4">
          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">
            {t("clientValue")}
          </p>
          <p className="text-sm text-navy-800 font-medium">{valueProp}</p>
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {member.expertise_areas.slice(0, 4).map((area) => {
            const displayName = EXPERTISE_DISPLAY_NAMES[area]?.[locale] || area;
            return (
              <span
                key={area}
                className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
              >
                {displayName}
              </span>
            );
          })}
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 pt-4 mt-4 space-y-4"
          >
            {/* Certifications */}
            {member.certifications.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">{t("certifications")}</p>
                <div className="flex flex-wrap gap-2">
                  {member.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-2 py-1 bg-gold/10 text-gold-dark text-xs rounded-md"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            {member.awards.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">{t("awards")}</p>
                <ul className="space-y-1">
                  {member.awards.slice(0, 2).map((award) => (
                    <li key={award} className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold" />
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Client Regions */}
            {member.client_regions.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">{t("focusRegions")}</p>
                <div className="flex flex-wrap gap-2">
                  {member.client_regions.map((region) => (
                    <span
                      key={region}
                      className="px-2 py-1 bg-navy-900/5 text-navy-800 text-xs rounded-md"
                    >
                      {t(`regions.${region}`)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* LinkedIn */}
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan hover:text-cyan-dark transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                {t("linkedin")}
              </a>
            )}
          </motion.div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 text-sm font-medium text-slate-500 hover:text-navy-900 transition-colors border-t border-slate-100 mt-2"
        >
          {isExpanded ? t("showLess") : t("showMore")}
        </button>
      </div>
    </motion.div>
  );
}

// Main Team Section Component
export default function TeamSection() {
  const t = useTranslations("team");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Separate founder from other members
  const founder = members.find((m) => m.member_type === "founder");
  const advisors = members.filter((m) => m.member_type !== "founder");

  if (loading) {
    return (
      <section className="section-padding container-padding bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-4" />
            <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding container-padding bg-slate-50" id="team">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1 bg-cyan" />
            <span className="text-sm font-semibold text-cyan uppercase tracking-wider">
              {t("eyebrow")}
            </span>
            <div className="w-12 h-1 bg-cyan" />
          </div>
          <h2 className="text-headline text-navy-900 max-w-3xl mx-auto mb-4">
            {t("title")}
          </h2>
          <p className="text-lead text-slate-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Founder Spotlight */}
        {founder && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1 bg-gold/10 text-gold-dark rounded-full text-sm font-semibold">
                {t("founderTitle")}
              </span>
              <div className="flex-1 h-px bg-gold/30" />
            </div>
            <div className="max-w-2xl mx-auto">
              <MemberCard member={founder} isFounder={true} />
            </div>
          </div>
        )}

        {/* Advisors Grid */}
        {advisors.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="px-4 py-1 bg-cyan/10 text-cyan-dark rounded-full text-sm font-semibold">
                {t("advisorsTitle")}
              </span>
              <div className="flex-1 h-px bg-cyan/30" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advisors.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Coming Soon */}
        {members.length <= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-500 mb-2">{t("expandingTeam")}</p>
            <p className="text-sm text-slate-400">{t("stayTuned")}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
