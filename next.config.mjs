/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase storage CDN — adjust project-ref before going live
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
  },
  // Stricter mode catches React anti-patterns early
  reactStrictMode: true,
};

export default nextConfig;
