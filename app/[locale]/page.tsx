"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Navbar from "@/components/navigation/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import TeamSection from "@/components/sections/TeamSection";
import CaseStudySection from "@/components/sections/CaseStudySection";
import StrategicPartnersSection from "@/components/sections/StrategicPartnersSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section - Macro Narrative & Strategic Positioning */}
      <HeroSection />

      {/* About Section - Strategic Collective Narrative */}
      <AboutSection />

      {/* Team Section - Elite Advisory Collective */}
      <TeamSection />

      {/* Case Study Section - Beevest Transformation (FTI Style) */}
      <CaseStudySection />

      {/* Strategic Partners Section - HKCAS/SUNY/CBPM */}
      <StrategicPartnersSection />

      {/* Stats Section - Palantir-inspired data display */}
      <section className="section-padding-sm container-padding bg-navy-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="stat-value">{t("stats.experience.value")}</div>
              <div className="stat-label text-slate-400 mt-2">
                {t("stats.experience.label")}
              </div>
            </div>
            <div className="text-center">
              <div className="stat-value">{t("stats.efficiency.value")}</div>
              <div className="stat-label text-slate-400 mt-2">
                {t("stats.efficiency.label")}
              </div>
            </div>
            <div className="text-center">
              <div className="stat-value">{t("stats.projects.value")}</div>
              <div className="stat-label text-slate-400 mt-2">
                {t("stats.projects.label")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Competencies Section */}
      <section className="section-padding container-padding bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-headline text-navy-900 mb-12 text-center">
            {t("competencies.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-institutional hover-lift">
              <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-title text-navy-900 mb-3">
                {t("competencies.cards.brokerage.title")}
              </h3>
              <p className="text-slate-600 text-body">
                {t("competencies.cards.brokerage.description")}
              </p>
            </div>

            <div className="card-institutional hover-lift">
              <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-cyan"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-title text-navy-900 mb-3">
                {t("competencies.cards.ai.title")}
              </h3>
              <p className="text-slate-600 text-body">
                {t("competencies.cards.ai.description")}
              </p>
            </div>

            <div className="card-institutional hover-lift">
              <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-title text-navy-900 mb-3">
                {t("competencies.cards.gr.title")}
              </h3>
              <p className="text-slate-600 text-body">
                {t("competencies.cards.gr.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Lead Capture with Whitepaper Download */}
      <ContactSection />

      {/* Dark CTA Section - Palantir aesthetic */}
      <section className="section-padding container-padding bg-deep-navy">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-headline text-slate-50 mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-lead text-slate-300 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <div className="divider-cyan w-24 mx-auto mb-8" />
          <Link
            href="/contact"
            locale={locale}
            className="inline-block px-8 py-4 bg-gold text-navy-900 rounded-md hover:bg-gold-light transition-colors font-semibold text-lg"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-padding-sm container-padding bg-navy-950 border-t border-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-small">
              {t("footer.copyright")}
            </div>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                locale={locale}
                className="text-slate-400 hover:text-gold transition-colors text-small"
              >
                {t("footer.links.privacy")}
              </Link>
              <Link
                href="/terms"
                locale={locale}
                className="text-slate-400 hover:text-gold transition-colors text-small"
              >
                {t("footer.links.terms")}
              </Link>
              <Link
                href="/contact"
                locale={locale}
                className="text-slate-400 hover:text-gold transition-colors text-small"
              >
                {t("footer.links.contact")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
