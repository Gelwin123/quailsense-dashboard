const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // ✅ disable in dev
});

module.exports = withPWA({
  reactStrictMode: true,
});
