import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  // Default was false. Toggle to `false` if locale URLs or OpenNext + i18n behave better without trailing slash.
  trailingSlash: true,
  experimental: {
    // Allow resolving packages outside the app directory; can change how modules are traced (aligns with common OpenNext guidance).
    externalDir: true,
  },
  serverExternalPackages: [
    "bcryptjs",
    "@supabase/supabase-js",
    "resend",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Backup redirect if middleware/static routing behaves differently on the host (e.g. some CDN edge paths).
  async redirects() {
    return [{ source: "/", destination: "/en/", permanent: false }];
  },
};

export default withNextIntl(nextConfig);
