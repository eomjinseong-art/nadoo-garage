import Link from "next/link";
import { CoupangBanner } from "@/components/CoupangBanner";
import { SISTER_SITES, SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <CoupangBanner />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-serif text-lg">{SITE_NAME}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          나두카 운영자가 실제로 함께했던 자동차와 모터사이클을 모은 개인 차고 기록입니다. 제조사와 제휴·후원 관계가 없으며,
          상표와 로고는 각 권리자의 소유입니다. 신차가는 당시 국내 출시 자료를 기준으로 한 대략적인 금액입니다.
        </p>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm" aria-label="바닥">
          <Link href="/cars" className="hover:text-accent">자동차</Link>
          <Link href="/bikes" className="hover:text-accent">모터사이클</Link>
          <Link href="/credits" className="hover:text-accent">사진 크레딧</Link>
        </nav>
        <nav className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted" aria-label="나두카 자매 아카이브">
          <span className="text-xs tracking-wide text-accent">나두카</span>
          {SISTER_SITES.map((site) => (
            <a key={site.href} href={site.href} className="hover:text-accent" target="_blank" rel="noopener noreferrer">
              {site.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
