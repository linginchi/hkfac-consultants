"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Admin Logo Component
function AdminLogo() {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center border border-gold/30">
        <span className="text-gold font-bold text-lg">FAC</span>
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-50">FAC Hong Kong</h1>
        <p className="text-xs text-cyan font-medium tracking-wider uppercase">
          Administrative Strategic Hub
        </p>
      </div>
    </div>
  );
}

// Login Form Component
function LoginForm({
  onForgotPassword,
}: {
  onForgotPassword: () => void;
}) {
  const t = useTranslations("adminLogin");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate email format
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error(t("errors.invalidEmail"));
      }

      // Only allow mark@hkfac.com
      if (email.toLowerCase() !== "mark@hkfac.com") {
        throw new Error(t("errors.unauthorized"));
      }

      // Call login API
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, locale }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.invalidCredentials"));
      }

      // Check if first login
      if (data.isFirstLogin) {
        router.push(`/${locale}/admin/reset-password?first=true`);
      } else {
        router.push(`/${locale}/admin/dashboard`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <AdminLogo />

      <div className="mt-8 bg-navy-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-slate-50 mb-2">{t("title")}</h2>
        <p className="text-slate-400 text-sm mb-6">{t("subtitle")}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t("email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t("password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-cyan hover:bg-cyan-dark text-navy-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t("signingIn")}
              </>
            ) : (
              <>
                {t("signIn")}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <button
            onClick={onForgotPassword}
            className="text-sm text-slate-400 hover:text-cyan transition-colors"
          >
            {t("forgotPassword")}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            locale={locale}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← {t("backToSite")}
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        {t("securityNote")}
      </p>
    </motion.div>
  );
}

// Forgot Password Form Component
function ForgotPasswordForm({
  onBack,
}: {
  onBack: () => void;
}) {
  const t = useTranslations("adminLogin");
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (email.toLowerCase() !== "mark@hkfac.com") {
        throw new Error(t("errors.unauthorized"));
      }

      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.sendFailed"));
      }

      setSuccess(true);
      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.invalidCode"));
      }

      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("errors.passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.resetFailed"));
      }

      setSuccess(true);
      setTimeout(() => onBack(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <AdminLogo />

      <div className="mt-8 bg-navy-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-slate-50">{t("forgotTitle")}</h2>
        </div>

        {success && step === "email" && (
          <div className="mb-4 p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
            <p className="text-cyan text-sm">{t("codeSent")}</p>
          </div>
        )}

        {success && step === "reset" && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">{t("resetSuccess")}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.form
              key="email"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSendCode}
              className="space-y-5"
            >
              <p className="text-slate-400 text-sm">{t("forgotDescription")}</p>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-cyan hover:bg-cyan-dark text-navy-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("sending") : t("sendCode")}
              </button>
            </motion.form>
          )}

          {step === "verify" && (
            <motion.form
              key="verify"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleVerifyCode}
              className="space-y-5"
            >
              <p className="text-slate-400 text-sm">{t("verifyDescription")}</p>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("verificationCode")}
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder={t("codePlaceholder")}
                  maxLength={6}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all text-center text-2xl tracking-widest"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full py-3.5 bg-cyan hover:bg-cyan-dark text-navy-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("verifying") : t("verify")}
              </button>
            </motion.form>
          )}

          {step === "reset" && (
            <motion.form
              key="reset"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleResetPassword}
              className="space-y-5"
            >
              <p className="text-slate-400 text-sm">{t("resetDescription")}</p>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("newPassword")}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("newPasswordPlaceholder")}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("confirmPassword")}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("confirmPasswordPlaceholder")}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-cyan hover:bg-cyan-dark text-navy-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("resetting") : t("resetPassword")}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Main Login Page Component
export default function AdminLoginPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen bg-deep-navy flex items-center justify-center p-4">
      {/* Background Grid Pattern - Palantir Style */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="adminGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#adminGrid)" />
        </svg>
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-navy-900/50 via-transparent to-cyan/5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full flex justify-center">
        <AnimatePresence mode="wait">
          {showForgotPassword ? (
            <ForgotPasswordForm
              key="forgot"
              onBack={() => setShowForgotPassword(false)}
            />
          ) : (
            <LoginForm
              key="login"
              onForgotPassword={() => setShowForgotPassword(true)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
