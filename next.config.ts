import type { NextConfig } from "next";
import packageJson from './package.json' with { type: 'json' };

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true, 
      },
    ]
  },
  env: {
    NEXT_PUBLIC_APP_NAME: packageJson.name,
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

export default nextConfig;
