"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
  region: string;
  investmentFocus: string;
  message: string;
  whitepaperRequest: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    title: "",
    region: "",
    investmentFocus: "",
    message: "",
    whitepaperRequest: true, // Default to true for lead capture
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("errors.required");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("errors.required");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("errors.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("errors.invalidEmail");
    }
    if (!formData.company.trim()) {
      newErrors.company = t("errors.required");
    }
    if (!formData.title.trim()) {
      newErrors.title = t("errors.required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          title: "",
          region: "",
          investmentFocus: "",
          message: "",
          whitepaperRequest: true,
        });
      } else {
        setSubmitStatus("error");
        console.error("Form submission error:", data.error);
      }
    } catch (error) {
      setSubmitStatus("error");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <section className="section-padding container-padding bg-slate-50" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Whitepaper Preview & Context */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
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

            <p className="text-lead text-slate-600 mb-8">
              {t("subtitle")}
            </p>

            {/* Whitepaper Preview Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-16 h-20 bg-navy-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-navy-900 mb-2">{t("whitepaper.title")}</h3>
                  <p className="text-sm text-slate-600 mb-3">{t("whitepaper.description")}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-navy-900/10 text-navy-800 text-xs rounded">40 Years Experience</span>
                    <span className="px-2 py-1 bg-cyan/10 text-cyan-dark text-xs rounded">Regulatory Framework</span>
                    <span className="px-2 py-1 bg-gold/10 text-gold-dark text-xs rounded">Execution Playbook</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 italic">
                  {t("whitepaper.note")}
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-navy-900">{t("trust.security")}</p>
                  <p className="text-slate-500 text-xs">Enterprise-grade encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-navy-900">{t("trust.response")}</p>
                  <p className="text-slate-500 text-xs">Within 24 hours</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm">
              {submitStatus === "success" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">{t("success.title")}</h3>
                  <p className="text-slate-600 mb-4">{t("success.message")}</p>
                  {formData.whitepaperRequest && (
                    <p className="text-sm text-slate-500">{t("success.whitepaper")}</p>
                  )}
                  <button
                    onClick={() => setSubmitStatus("idle")}
                    className="mt-6 px-6 py-2 bg-navy-900 text-slate-50 rounded-lg hover:bg-navy-800 transition-colors"
                  >
                    {t("success.reset")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-navy-900 mb-1">
                        {t("form.firstName")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          errors.firstName ? "border-red-500" : "border-slate-300"
                        } focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold`}
                        placeholder={t("form.firstNamePlaceholder")}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-navy-900 mb-1">
                        {t("form.lastName")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          errors.lastName ? "border-red-500" : "border-slate-300"
                        } focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold`}
                        placeholder={t("form.lastNamePlaceholder")}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-navy-900 mb-1">
                      {t("form.email")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.email ? "border-red-500" : "border-slate-300"
                      } focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold`}
                      placeholder={t("form.emailPlaceholder")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Company & Title Row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-navy-900 mb-1">
                        {t("form.company")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          errors.company ? "border-red-500" : "border-slate-300"
                        } focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold`}
                        placeholder={t("form.companyPlaceholder")}
                      />
                      {errors.company && (
                        <p className="mt-1 text-xs text-red-500">{errors.company}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-navy-900 mb-1">
                        {t("form.title")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          errors.title ? "border-red-500" : "border-slate-300"
                        } focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold`}
                        placeholder={t("form.titlePlaceholder")}
                      />
                      {errors.title && (
                        <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                      )}
                    </div>
                  </div>

                  {/* Region */}
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-navy-900 mb-1">
                      {t("form.region")}
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                    >
                      <option value="">{t("form.regionPlaceholder")}</option>
                      <option value="middle-east">{t("form.regions.middleEast")}</option>
                      <option value="southeast-asia">{t("form.regions.southeastAsia")}</option>
                      <option value="europe">{t("form.regions.europe")}</option>
                      <option value="americas">{t("form.regions.americas")}</option>
                      <option value="other">{t("form.regions.other")}</option>
                    </select>
                  </div>

                  {/* Investment Focus */}
                  <div>
                    <label htmlFor="investmentFocus" className="block text-sm font-medium text-navy-900 mb-1">
                      {t("form.investmentFocus")}
                    </label>
                    <input
                      type="text"
                      id="investmentFocus"
                      name="investmentFocus"
                      value={formData.investmentFocus}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                      placeholder={t("form.investmentFocusPlaceholder")}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-navy-900 mb-1">
                      {t("form.message")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold resize-none"
                      placeholder={t("form.messagePlaceholder")}
                    />
                  </div>

                  {/* Whitepaper Checkbox */}
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="whitepaperRequest"
                      name="whitepaperRequest"
                      checked={formData.whitepaperRequest}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-300 text-gold focus:ring-gold mt-0.5"
                    />
                    <label htmlFor="whitepaperRequest" className="text-sm text-slate-700 cursor-pointer">
                      <span className="font-medium text-navy-900">{t("form.whitepaper.label")}</span>
                      <p className="text-slate-500 mt-1">{t("form.whitepaper.description")}</p>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-navy-900 text-slate-50 font-semibold rounded-lg hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t("form.submitting")}
                      </>
                    ) : (
                      <>
                        {t("form.submit")}
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  {submitStatus === "error" && (
                    <p className="text-center text-red-500 text-sm">{t("form.error")}</p>
                  )}

                  <p className="text-center text-xs text-slate-400">
                    {t("form.privacy")}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
