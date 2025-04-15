import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // outras configurações aqui...
};

export default withPWA({
  dest: 'public',
})(nextConfig);
