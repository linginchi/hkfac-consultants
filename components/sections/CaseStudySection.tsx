"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

// Timeline milestone component
function TimelineMilestone({
  year,
  title,
  description,
  index,
}: {
  year: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-gold via-gold/50 to-transparent" />
      
      {/* Timeline dot */}
      <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-gold border-2 border-white shadow-sm" />
      
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
        <span className="text-sm font-bold text-gold-dark">{year}</span>
        <h4 className="font-semibold text-navy-900">{title}</h4>
      </div>
      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Metric card component - FTI Consulting style
function MetricCard({
  value,
  label,
  context,
  highlight = false,
  delay = 0,
}: {
  value: string;
  label: string;
  context: string;
  highlight?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`p-6 rounded-xl border ${
        highlight
          ? "bg-navy-900 text-slate-50 border-navy-700"
          : "bg-white border-slate-200"
      }`}
    >
      <div className={`text-3xl sm:text-4xl font-bold ${highlight ? "text-gold" : "text-navy-900"}`}>
        {value}
      </div>
      <div className={`mt-2 text-sm font-medium ${highlight ? "text-slate-300" : "text-slate-600"}`}>
        {label}
      </div>
      <div className={`mt-1 text-xs ${highlight ? "text-slate-400" : "text-slate-400"}`}>
        {context}
      </div>
    </motion.div>
  );
}

export default function CaseStudySection() {
  const t = useTranslations("caseStudy");

  const timeline = [
    {
      year: t("timeline.phase1.year"),
      title: t("timeline.phase1.title"),
      description: t("timeline.phase1.description"),
    },
    {
      year: t("timeline.phase2.year"),
      title: t("timeline.phase2.title"),
      description: t("timeline.phase2.description"),
    },
    {
      year: t("timeline.phase3.year"),
      title: t("timeline.phase3.title"),
      description: t("timeline.phase3.description"),
    },
    {
      year: t("timeline.phase4.year"),
      title: t("timeline.phase4.title"),
      description: t("timeline.phase4.description"),
    },
  ];

  return (
    <section className="section-padding container-padding bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - FTI Consulting authority style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-1 bg-gold" />
            <span className="text-sm font-semibold text-gold-dark uppercase tracking-wider">
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

        {/* Main Case Study Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Metrics & Key Data (FTI Style) */}
          <div>
            <h3 className="text-title text-navy-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t("metrics.title")}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                value={t("metrics.revenue.value")}
                label={t("metrics.revenue.label")}
                context={t("metrics.revenue.context")}
                highlight={true}
                delay={0}
              />
              <MetricCard
                value={t("metrics.turnaround.value")}
                label={t("metrics.turnaround.label")}
                context={t("metrics.turnaround.context")}
                delay={0.1}
              />
              <MetricCard
                value={t("metrics.traders.value")}
                label={t("metrics.traders.label")}
                context={t("metrics.traders.context")}
                delay={0.2}
              />
              <MetricCard
                value={t("metrics.recognition.value")}
                label={t("metrics.recognition.label")}
                context={t("metrics.recognition.context")}
                delay={0.3}
              />
            </div>

            {/* Key Insight Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 p-6 bg-cyan/5 border-l-4 border-cyan rounded-r-xl"
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-navy-900 mb-1">{t("insight.title")}</h4>
                  <p className="text-sm text-slate-600">{t("insight.description")}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Transformation Timeline */}
          <div>
            <h3 className="text-title text-navy-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("transformation.title")}
            </h3>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              {timeline.map((item, index) => (
                <TimelineMilestone
                  key={index}
                  year={item.year}
                  title={item.title}
                  description={item.description}
                  index={index}
                />
              ))}
            </div>

            {/* Strategic Impact Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 p-4 bg-navy-50 rounded-lg border border-navy-100"
            >
              <p className="text-sm text-navy-800 italic">
                &ldquo;{t("impact.quote")}&rdquo;
              </p>
              <p className="mt-2 text-xs text-navy-600 font-medium">
                — {t("impact.attribution")}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Service Methodology Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-8 bg-navy-900 rounded-2xl text-slate-50"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-gold font-bold text-lg">01</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">{t("methodology.step1.title")}</h4>
                <p className="text-sm text-slate-400">{t("methodology.step1.desc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan/20 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan font-bold text-lg">02</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">{t("methodology.step2.title")}</h4>
                <p className="text-sm text-slate-400">{t("methodology.step2.desc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-gold font-bold text-lg">03</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">{t("methodology.step3.title")}</h4>
                <p className="text-sm text-slate-400">{t("methodology.step3.desc")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
