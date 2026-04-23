"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

// Partner card component
function PartnerCard({
  name,
  fullName,
  description,
  relationship,
  year,
  index,
  icon,
}: {
  name: string;
  fullName: string;
  description: string;
  relationship: string;
  year: string;
  index: number;
  icon: "academic" | "government" | "nonprofit";
}) {
  const icons = {
    academic: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0v8" />
      </svg>
    ),
    government: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    nonprofit: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group relative bg-white rounded-xl p-6 border border-slate-200 hover:border-gold/50 hover:shadow-lg transition-all duration-300"
    >
      {/* Year Badge */}
      <div className="absolute top-4 right-4 text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded">
        {year}
      </div>

      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-navy-900 text-gold flex items-center justify-center mb-4">
        {icons[icon]}
      </div>

      {/* Partner Name */}
      <h3 className="text-lg font-bold text-navy-900 mb-1">{name}</h3>
      <p className="text-sm text-slate-500 mb-3">{fullName}</p>

      {/* Relationship Tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold-dark text-xs font-semibold rounded-full mb-4">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {relationship}
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Network diagram visualization
function PartnershipNetwork() {
  return (
    <div className="relative h-64 md:h-80 bg-navy-900 rounded-xl overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          <defs>
            <pattern id="networkGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#networkGrid)" />
        </svg>
      </div>

      {/* Network Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        {/* Connection lines */}
        <motion.path
          d="M200,150 L100,80"
          stroke="#D4AF37"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.path
          d="M200,150 L300,80"
          stroke="#D4AF37"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.path
          d="M200,150 L200,220"
          stroke="#06B6D4"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
        />

        {/* Nodes */}
        <motion.circle
          cx="200"
          cy="150"
          r="20"
          fill="#0F172A"
          stroke="#D4AF37"
          strokeWidth="2"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />
        <motion.circle
          cx="100"
          cy="80"
          r="15"
          fill="#0F172A"
          stroke="#D4AF37"
          strokeWidth="1.5"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.circle
          cx="300"
          cy="80"
          r="15"
          fill="#0F172A"
          stroke="#D4AF37"
          strokeWidth="1.5"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        <motion.circle
          cx="200"
          cy="220"
          r="15"
          fill="#0F172A"
          stroke="#06B6D4"
          strokeWidth="1.5"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />

        {/* Labels */}
        <text x="200" y="155" textAnchor="middle" fill="#D4AF37" fontSize="10" fontWeight="bold">FAC</text>
        <text x="100" y="60" textAnchor="middle" fill="#94A3B8" fontSize="9">HKCAS</text>
        <text x="300" y="60" textAnchor="middle" fill="#94A3B8" fontSize="9">SUNY</text>
        <text x="200" y="250" textAnchor="middle" fill="#94A3B8" fontSize="9">CBPM</text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-gold bg-navy-900" />
          <span className="text-slate-400">Strategic Partners</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-cyan bg-navy-900" />
          <span className="text-slate-400">State Partnership</span>
        </div>
      </div>
    </div>
  );
}

export default function StrategicPartnersSection() {
  const t = useTranslations("partners");

  const partners = [
    {
      name: t("hkcas.name"),
      fullName: t("hkcas.fullName"),
      description: t("hkcas.description"),
      relationship: t("hkcas.relationship"),
      year: t("hkcas.year"),
      icon: "nonprofit" as const,
    },
    {
      name: t("suny.name"),
      fullName: t("suny.fullName"),
      description: t("suny.description"),
      relationship: t("suny.relationship"),
      year: t("suny.year"),
      icon: "academic" as const,
    },
    {
      name: t("cbpm.name"),
      fullName: t("cbpm.fullName"),
      description: t("cbpm.description"),
      relationship: t("cbpm.relationship"),
      year: t("cbpm.year"),
      icon: "government" as const,
    },
  ];

  return (
    <section className="section-padding container-padding bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-1 bg-cyan" />
            <span className="text-sm font-semibold text-cyan uppercase tracking-wider">
              {t("eyebrow")}
            </span>
          </div>
          <h2 className="text-headline text-navy-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lead text-slate-600">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Network Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <PartnershipNetwork />
        </motion.div>

        {/* Partner Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
            <PartnerCard
              key={partner.name}
              {...partner}
              index={index}
            />
          ))}
        </div>

        {/* Strategic Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 p-8 bg-slate-50 rounded-xl border border-slate-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">{t("valueProp.title")}</h3>
              <p className="text-slate-600 leading-relaxed">{t("valueProp.description")}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-navy-900/10 text-navy-800 text-sm font-medium rounded-full">
                  {t("valueProp.tag1")}
                </span>
                <span className="px-3 py-1 bg-cyan/10 text-cyan-dark text-sm font-medium rounded-full">
                  {t("valueProp.tag2")}
                </span>
                <span className="px-3 py-1 bg-gold/10 text-gold-dark text-sm font-medium rounded-full">
                  {t("valueProp.tag3")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
