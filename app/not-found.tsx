import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notfound">
      <span className="notfound-code">404</span>
      <h1>页面没找到</h1>
      <p>你要找的页面可能已被移动，或链接拼写有误。</p>
      <Link className="btn btn-primary" href="/zh-CN">
        返回首页
      </Link>
    </main>
  );
}
