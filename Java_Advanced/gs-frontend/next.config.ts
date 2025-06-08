// next.config.ts
import path from "path";
import { NextConfig } from "next";

const javaApiBaseUrl = process.env.JAVA_API_BASE_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  // Configuração para permitir SVG externos (shields.io, etc)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.shields.io",
        port: "",
        pathname: "/badge/**"
      },
      {
        protocol: "https",
        hostname: "reliefweb.int",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "api.reliefweb.int",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "unpkg.com",
        port: "",
        pathname: "/**"
      }
      // Adicione outros padrões, se necessário
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${javaApiBaseUrl}/api/:path*`,
      },
    ];
  },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
