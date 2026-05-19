import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer({
  turbo: {
    root: "../",
  },
  turbopack: {
    root: "../",
  },
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: "http://localhost:3001/:path*",
      },
    ];
  },
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
});
