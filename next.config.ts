import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'b2b-eliq.pl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'e-papierosy.pl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'doctorvape.eu',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
