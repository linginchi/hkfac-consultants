"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";

export default function AboutSection() {
  const t = useTranslations("about");
  const locale = useLocale();

  return (
    <section className="section-padding container-padding bg-white" id="about">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1 bg-gold" />
            <span className="text-sm font-semibold text-gold-dark uppercase tracking-wider">
              {t("eyebrow")}
            </span>
            <div className="w-12 h-1 bg-gold" />
          </div>
          <h2 className="text-headline text-navy-900 max-w-3xl mx-auto">
            {t("title")}
          </h2>
        </motion.div>

        {/* Main Narrative - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
          {/* Left Column - Strategic Collective Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed">
                {t("narrative.paragraph1")}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {t("narrative.paragraph2")}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {t("narrative.paragraph3")}
              </p>
            </div>

            {/* Core Values Callout */}
            <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-gold">
              <h3 className="font-semibold text-navy-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t("values.title")}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan mt-2 flex-shrink-0" />
                  <span className="text-slate-600 text-sm">{t("values.engineerLogic")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan mt-2 flex-shrink-0" />
                  <span className="text-slate-600 text-sm">{t("values.marathonResilience")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan mt-2 flex-shrink-0" />
                  <span className="text-slate-600 text-sm">{t("values.institutionalMemory")}</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right Column - Team Composition Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Team Composition Diagram */}
            <div className="bg-navy-900 rounded-2xl p-8 text-slate-50">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t("composition.title")}
              </h3>

              {/* Founder Hub */}
              <div className="mb-6 p-4 bg-gold/10 rounded-lg border border-gold/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold font-bold text-sm">ML</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gold">{t("composition.founder.name")}</p>
                    <p className="text-sm text-slate-400">{t("composition.founder.role")}</p>
                  </div>
                </div>
              </div>

              {/* Connecting Lines - Visual only */}
              <div className="flex justify-center mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} strokeDasharray="4 4" d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>

              {/* Expertise Areas Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <svg className="w-5 h-5 text-cyan mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <p className="text-xs font-medium text-slate-300">{t("composition.legal")}</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <svg className="w-5 h-5 text-cyan mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-xs font-medium text-slate-300">{t("composition.compliance")}</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <svg className="w-5 h-5 text-cyan mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-xs font-medium text-slate-300">{t("composition.fintech")}</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <svg className="w-5 h-5 text-cyan mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-xs font-medium text-slate-300">{t("composition.govRelations")}</p>
                </div>
              </div>
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-6 -right-6 bg-gold text-navy-900 rounded-xl p-4 shadow-lg">
              <p className="text-2xl font-bold">{t("experience.years")}</p>
              <p className="text-xs font-medium uppercase tracking-wider">{t("experience.label")}</p>
            </div>
          </motion.div>
        </div>

        {/* Philosophy Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-gold/50 transition-colors"
          >
            <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">{t("philosophy.wisdom.title")}</h3>
            <p className="text-sm text-slate-600">{t("philosophy.wisdom.description")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-cyan/50 transition-colors"
          >
            <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">{t("philosophy.logic.title")}</h3>
            <p className="text-sm text-slate-600">{t("philosophy.logic.description")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-gold/50 transition-colors"
          >
            <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">{t("philosophy.endurance.title")}</h3>
            <p className="text-sm text-slate-600">{t("philosophy.endurance.description")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
