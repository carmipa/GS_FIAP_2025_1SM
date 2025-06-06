import path from "path";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // Configuração de rewrites para evitar problemas de CORS
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
            // Adicione outros endpoints conforme necessário
        ];
    },

    webpack(config) {
        // Alias para facilitar importações
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(__dirname, "src"),
        };

        return config;
    },
};

export default nextConfig;