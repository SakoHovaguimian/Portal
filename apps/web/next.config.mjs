const nextConfig = {
  transpilePackages: ['@semantic-web/core', '@semantic-web/api-sdk', '@semantic-web/ui'],
  typedRoutes: true,
  serverExternalPackages: ['firebase-admin'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
