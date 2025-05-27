// next.config.ts
import path from 'path'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        appDir: true,
    },
    webpack(config) {
        config.resolve.alias['@'] = path.resolve(__dirname, 'src')
        return config
    },
}

export default nextConfig
