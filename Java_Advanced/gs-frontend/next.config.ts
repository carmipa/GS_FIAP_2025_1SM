// next.config.ts

import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    images: {
        remotePatterns: [
            // Configuração que já existia
            {
                protocol: 'https',
                hostname: 'reliefweb.int',
                port: '',
                pathname: '/sites/default/files/**',
            },
            // NOVO: Adicionado para permitir badges do shields.io
            {
                protocol: 'https',
                hostname: 'img.shields.io',
                port: '',
                pathname: '/badge/**',
            },
        ],
    },

    // Sua configuração de rewrites (mantida)
    async rewrites() {
        return [
            {
                source: "/api/clientes",
                destination: "http://localhost:8080/api/clientes",
            },
            {
                source: "/api/endereco",
                destination: "http://localhost:8080/api/endereco",
            },
        ];
    },

    // Sua configuração do Webpack (mantida)
    webpack(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(__dirname, "src"),
        };

        return config;
    },
};

export default nextConfig;