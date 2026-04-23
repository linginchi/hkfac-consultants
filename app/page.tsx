export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Brunswick-inspired whitespace + FTI authority */}
      <section className="section-padding container-padding bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="divider-gold w-16 mb-8" />
            <h1 className="text-hero text-navy-900 mb-6">
              Wisdom of a <span className="accent-gold">Veteran</span>.<br />
              Logic of an <span className="accent-cyan">Engineer</span>.
            </h1>
            <p className="text-lead max-w-2xl mb-8">
              FAC bridges Western enterprise ambitions and Greater China market realities 
              with 40 years of FinTech expertise and AI-native execution power.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-navy-900 text-slate-50 rounded-md hover:bg-navy-800 transition-colors font-medium">
                Explore Services
              </button>
              <button className="px-6 py-3 border border-navy-700 text-navy-900 rounded-md hover:bg-navy-50 transition-colors font-medium">
                View Case Studies
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Palantir-inspired data display */}
      <section className="section-padding-sm container-padding bg-navy-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="stat-value">40</div>
              <div className="stat-label text-slate-400 mt-2">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="stat-value">10x</div>
              <div className="stat-label text-slate-400 mt-2">AI Efficiency</div>
            </div>
            <div className="text-center">
              <div className="stat-value">200B+</div>
              <div className="stat-label text-slate-400 mt-2">RMB Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions - FTI case-study cards */}
      <section className="section-padding container-padding bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-headline text-navy-900 mb-12 text-center">
            Core Competencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-institutional hover-lift">
              <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-title text-navy-900 mb-3">Brokerage Transformation</h3>
              <p className="text-slate-600 text-body">
                End-to-end lifecycle modernization from M&A to digital pivoting. 
                Proven track record: HKD 1B+ annual revenue at peak.
              </p>
            </div>

            <div className="card-institutional hover-lift">
              <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-title text-navy-900 mb-3">AI-Native Execution</h3>
              <p className="text-slate-600 text-body">
                We build, not just strategize. Claude, Cursor, and China&apos;s leading models 
                deliver 10x development efficiency for partners.
              </p>
            </div>

            <div className="card-institutional hover-lift">
              <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-title text-navy-900 mb-3">Government Relations</h3>
              <p className="text-slate-600 text-body">
                Elite access to decision-makers in Hong Kong and Mainland China. 
                SFC/HKEX compliance expertise and SOE partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark CTA Section - Palantir aesthetic */}
      <section className="section-padding container-padding bg-deep-navy">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-headline text-slate-50 mb-6">
            Ready to Navigate Greater China?
          </h2>
          <p className="text-lead text-slate-300 mb-8 max-w-2xl mx-auto">
            Partner with a 40-year veteran who combines the wisdom of experience 
            with the agility of AI-native execution.
          </p>
          <div className="divider-cyan w-24 mx-auto mb-8" />
          <button className="px-8 py-4 bg-gold text-navy-900 rounded-md hover:bg-gold-light transition-colors font-semibold text-lg">
            Schedule a Consultation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-padding-sm container-padding bg-navy-950 border-t border-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-small">
              © 2026 FAC (Hong Kong) Ltd. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-gold transition-colors text-small">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-gold transition-colors text-small">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-gold transition-colors text-small">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
