"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

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

export default function ResetPasswordPage() {
  const t = useTranslations("adminLogin");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isFirstLogin = searchParams.get("first") === "true";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Prevent access if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/admin/check-session");
      if (!response.ok) {
        router.push(`/${locale}/admin/login`);
      }
    };
    
    // Only check if it's first login (coming from login flow)
    // If coming from forgot password, the code verification already authenticated
    if (!isFirstLogin) {
      checkAuth();
    }
  }, [locale, router, isFirstLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("errors.passwordTooShort"));
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError(t("errors.passwordNoUppercase"));
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError(t("errors.passwordNoNumber"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          newPassword,
          isFirstLogin 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.changeFailed"));
      }

      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push(`/${locale}/admin/dashboard`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-navy flex items-center justify-center p-4">
      {/* Background Grid Pattern */}
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

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-navy-900/50 via-transparent to-gold/5 pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <AdminLogo />

        <div className="mt-8 bg-navy-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          {isFirstLogin ? (
            <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-lg font-bold text-gold">{t("firstLoginTitle")}</h2>
              </div>
              <p className="text-sm text-slate-300">{t("firstLoginDescription")}</p>
            </div>
          ) : (
            <h2 className="text-2xl font-bold text-slate-50 mb-2">{t("changePasswordTitle")}</h2>
          )}

          {success ? (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-400 font-medium">{t("passwordChanged")}</p>
              </div>
              <p className="text-sm text-slate-400">{t("redirecting")}</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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
                  <p className="mt-1 text-xs text-slate-500">{t("passwordRequirements")}</p>
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
                  className="w-full py-3.5 bg-cyan hover:bg-cyan-dark text-navy-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t("updating")}
                    </>
                  ) : (
                    <>
                      {isFirstLogin ? t("setPassword") : t("updatePassword")}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {isFirstLogin && (
                <p className="mt-4 text-xs text-slate-500 text-center">
                  {t("cannotSkip")}
                </p>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
