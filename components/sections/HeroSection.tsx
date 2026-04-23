"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";

// Marathon Endurance Visual - Abstract flowing lines representing runner's journey
function MarathonEnduranceVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary endurance lines - flowing from left to right like a marathon course */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for endurance lines - from deep navy to gold */}
          <linearGradient id="enduranceGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#0B1426" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
          </linearGradient>
          
          {/* Glow effect for the path */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Abstract marathon course lines - representing long-term commitment */}
        <motion.path
          d="M-100,400 Q200,300 400,350 T800,320 T1300,380"
          fill="none"
          stroke="url(#enduranceGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        
        <motion.path
          d="M-100,450 Q300,380 500,420 T900,390 T1300,430"
          fill="none"
          stroke="url(#enduranceGradient)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.8, delay: 0.3, ease: "easeInOut" }}
        />

        {/* Marathon milestone markers - representing long-term partnership checkpoints */}
        {[200, 450, 700, 950].map((x, index) => (
          <motion.circle
            key={x}
            cx={x}
            cy={360 + index * 15}
            r="6"
            fill="#D4AF37"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 0.5, delay: 1.5 + index * 0.2 }}
          />
        ))}

        {/* Runner silhouette - abstract representation of forward momentum */}
        <motion.g
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <path
            d="M50,380 L70,340 L90,360 L110,330 L130,350"
            fill="none"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.15"
          />
        </motion.g>

        {/* Animated pulse representing continuous effort */}
        <motion.ellipse
          cx="600"
          cy="400"
          rx="100"
          ry="60"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="1"
          opacity="0.1"
          animate={{
            rx: [100, 150, 100],
            ry: [60, 90, 60],
            opacity: [0.1, 0.05, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Grid pattern overlay - subtle data/tech aesthetic (Palantir-inspired) */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0F172A 1px, transparent 1px),
            linear-gradient(to bottom, #0F172A 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

// President's Club Badge - subtle indicator of global excellence
function PresidentsClubBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-full"
    >
      <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <span className="text-xs font-semibold text-gold-dark tracking-wide uppercase">
        President&apos;s Club Legacy
      </span>
    </motion.div>
  );
}

export default function HeroSection() {
  const t = useTranslations("heroSection");
  const locale = useLocale();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-50">
      {/* Visual Background Layer */}
      <MarathonEnduranceVisual />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Primary Content */}
          <div className="max-w-2xl">
            {/* Excellence Badge */}
            <PresidentsClubBadge />

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 leading-[1.1] tracking-tight"
            >
              {t("headline.part1")}
              <span className="text-gold"> {t("headline.highlight1")} </span>
              {t("headline.part2")}
              <br className="hidden sm:block" />
              <span className="text-cyan"> {t("headline.highlight2")} </span>
              {t("headline.part3")}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl"
            >
              {t("subheadline")}
            </motion.p>

            {/* Value Proposition Cards - Horizontal on desktop, stacked on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-navy-900/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 7m0 13V7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 text-sm">{t("valueProps.navigation.title")}</h3>
                  <p className="text-sm text-slate-500 mt-1">{t("valueProps.navigation.desc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 text-sm">{t("valueProps.acceleration.title")}</h3>
                  <p className="text-sm text-slate-500 mt-1">{t("valueProps.acceleration.desc")}</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/contact"
                locale={locale}
                className="inline-flex items-center justify-center px-8 py-4 bg-navy-900 text-slate-50 font-semibold rounded-lg hover:bg-navy-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {t("cta.primary")}
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/about"
                locale={locale}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-navy-700 text-navy-900 font-semibold rounded-lg hover:bg-navy-50 transition-all duration-200"
              >
                {t("cta.secondary")}
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 pt-8 border-t border-slate-200"
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">{t("trust.label")}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  {t("trust.point1")}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan" />
                  {t("trust.point2")}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Visual/Stats (visible on larger screens) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block relative"
          >
            <div className="relative bg-navy-900 rounded-2xl p-8 shadow-2xl overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="400" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative z-10">
                {/* Stat Card 1 */}
                <div className="mb-6 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-4xl font-bold text-cyan mb-2">{t("stats.years.value")}</div>
                  <div className="text-slate-300 text-sm">{t("stats.years.label")}</div>
                  <div className="mt-3 text-xs text-slate-400">{t("stats.years.context")}</div>
                </div>

                {/* Stat Card 2 */}
                <div className="mb-6 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-4xl font-bold text-gold mb-2">{t("stats.efficiency.value")}</div>
                  <div className="text-slate-300 text-sm">{t("stats.efficiency.label")}</div>
                  <div className="mt-3 text-xs text-slate-400">{t("stats.efficiency.context")}</div>
                </div>

                {/* Endurance Quote */}
                <div className="p-6 border-l-2 border-gold">
                  <p className="text-slate-300 italic text-sm leading-relaxed">
                    &ldquo;{t("endurance.quote")}&rdquo;
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gold text-xs font-semibold">{t("endurance.badge")}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
    </section>
  );
}
