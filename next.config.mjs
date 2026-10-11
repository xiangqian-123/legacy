/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 根路径 → 默认语言（英文）。
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      // 已删除的非英语言 → 对应英文页（301）。
      ...["zh-CN", "zh-TW", "ja", "ru", "de"].map((l) => ({
        source: `/${l}/:path*`,
        destination: "/en/:path*",
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
