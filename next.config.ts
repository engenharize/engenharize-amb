/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // <-- fora do "pwa"
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'], // ou outros domínios usados no app
  },
  // Se estiver usando next-pwa:
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  }
};

const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA(nextConfig);
