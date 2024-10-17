import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "cdn-icons-png.freepik.com"
            },
            {
                hostname: "icones.pro"
            },
            {
                hostname: "banner2.cleanpng.com" 
            }
        ]
    }
};

export default nextConfig;
