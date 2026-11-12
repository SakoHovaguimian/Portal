import type { NextConfig } from 'next';

const shareOrigin = process.env.PORTAL_SHARE_ORIGIN;
const nextConfig: NextConfig = {
  typedRoutes: true,
  poweredByHeader: false,
  ...(shareOrigin ? { allowedDevOrigins: [new URL(shareOrigin).hostname] } : {}),
};
export default nextConfig;
