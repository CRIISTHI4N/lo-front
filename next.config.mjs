/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        domains: ['192.168.1.25', 'localhost']
    },
    output: 'export',
};

export default nextConfig;
