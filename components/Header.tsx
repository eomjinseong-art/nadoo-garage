import Link from "next/link";
import { VisitorCounter } from "@/components/VisitorCounter";
import { SISTER_SITES, SITE_NAME } from "@/lib/site";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/cars", label: "자동차" },
  { href: "/bikes", label: "모터사이클" },
  { href: "/credits", label: "사진 크레딧" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl min-w-0 items-center gap-3 px-4 py-3">
        <Link href="/" className="min-w-0 shrink">
          <span className="block truncate font-serif text-base font-semibold leading-none tracking-tight sm:text-lg">
            {SITE_NAME}
          </span>
        </Link>
        <nav className="ml-4 hidden items-center gap-4 md:flex" aria-label="주요">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-ink hover:text-accent">
              {item.label}
            </Link>
          ))}
          {SISTER_SITES.map((site) => (
            <a key={site.href} href={site.href} className="text-sm text-muted hover:text-accent" target="_blank" rel="noopener noreferrer">
              {site.label.replace(" 아카이브", "")}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <VisitorCounter />
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-line px-2 py-1 text-sm">메뉴</summary>
            <nav className="absolute right-0 mt-2 grid w-48 gap-1 rounded-xl border border-line bg-card p-2 shadow-lg" aria-label="모바일">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm hover:bg-paper">
                  {item.label}
                </Link>
              ))}
              {SISTER_SITES.map((site) => (
                <a key={site.href} href={site.href} className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-paper" target="_blank" rel="noopener noreferrer">
                  {site.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
