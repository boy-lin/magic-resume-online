import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  webpack: (cfg) => {
    // Silence noisy warning from @supabase/realtime-js dynamic requires
    cfg.ignoreWarnings = [
      ...(cfg.ignoreWarnings || []),
      (warning) =>
        typeof warning === "object" &&
        warning?.message?.includes(
          "Critical dependency: the request of a dependency is an expression"
        ) &&
        /@supabase\/realtime-js/.test(warning?.module?.resource || ""),
    ];
    return cfg;
  },
};

// 只在生产环境启用PWA
const isProduction = process.env.NODE_ENV === "production";

export default withNextIntl(
  isProduction || process.env.NEXT_ENABLED_PWA === "true"
    ? withPWA({
        dest: "public",
        register: true,
        skipWaiting: true,
        disable: false,
        cacheOnFrontEndNav: true,
        aggressiveFrontEndNavCaching: true,
        reloadOnOnline: true,
        swcMinify: true,
        workboxOptions: {
          disableDevLogs: true,
        },
      })(config)
    : config
);
