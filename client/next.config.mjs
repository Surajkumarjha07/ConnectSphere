import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {hostname: "cdn-icons-png.freepik.com"},
            {hostname: "icones.pro"},
            {hostname: "banner2.cleanpng.com"},
            {hostname: "i.pinimg.com"},
            {hostname: "static.vecteezy.com"},
            {hostname: "cdn.icon-icons.com"},
            {hostname: "b2174441.smushcdn.com"},
            {hostname: "cdn3.iconfinder.com"},
            {hostname: "static-00.iconduck.com"},
            {hostname: "cdn-icons-png.flaticon.com"}
        ]
    }
};

export default nextConfig;
