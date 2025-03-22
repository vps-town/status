/** @type {import('next').NextConfig} */
const fs = require('node:fs');
const path = require('node:path');

const getImageDomains = () => {
    try {
        const configPath = path.join(process.cwd(), 'config', 'generated', 'image-domains.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config.domains;
    } catch (e) {
        return ['*'];
    }
};

const isDevelopment = process.env.NODE_ENV === 'development';

const productionConfig = {
    output: 'standalone',
    compiler: {
        removeConsole: false
    },
    images: {
        remotePatterns: getImageDomains().map(hostname => ({
            protocol: 'https',
            hostname,
        })),
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.join(__dirname),
        };
        return config;
    },
};

const developmentConfig = {
    compiler: {
        removeConsole: false
    },
    images: {
        remotePatterns: getImageDomains().map(hostname => ({
            protocol: 'https',
            hostname,
        })),
    },
};

module.exports = isDevelopment ? developmentConfig : productionConfig;