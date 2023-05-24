/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["wikimedia.org", "upload.wikimedia.org"],
  },
  experimental: {
    appDir: true,
  },
};
