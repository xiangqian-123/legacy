/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 根路径重定向：原 app/page.tsx 的 redirect 逻辑上移到这里，
  // 因为 html/body 已下沉到 [locale]/layout.tsx（lang 动态化）。
  async redirects() {
    return [{ source: "/", destination: "/zh-CN", permanent: false }];
  },
};

export default nextConfig;
