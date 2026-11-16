import Link from "next/link";
import { CoupangCard } from "@/components/CoupangCard";
import { JsonLd } from "@/components/JsonLd";
import { VehicleVisual } from "@/components/VehicleVisual";
import { bikes, cars, getImage, hrefFor, rankOf } from "@/lib/catalog";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import type { Vehicle } from "@/lib/types";

export function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
  const list = vehicle.kind === "car" ? cars : bikes;
  const rank = rankOf(vehicle);
  const prev = list[rank - 2];
  const next = list[rank];
  const image = getImage(vehicle.slug);
  const section = vehicle.kind === "car" ? { href: "/cars", label: "자동차" } : { href: "/bikes", label: "모터사이클" };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: section.label, item: absoluteUrl(section.href) },
            { "@type": "ListItem", position: 3, name: vehicle.nameKo, item: absoluteUrl(hrefFor(vehicle)) },
          ],
        }}
      />
      <nav className="text-sm text-muted" aria-label="경로">
        <Link href="/" className="hover:text-accent">홈</Link> / <Link href={section.href} className="hover:text-accent">{section.label}</Link>
      </nav>
      <header className="mt-4">
        <p className="text-xs tracking-wide text-accent">
          {section.label} 신차가 순 {rank}번째 · {vehicle.brand}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">{vehicle.nameKo}</h1>
        <p className="mt-1 text-muted">{vehicle.nameEn}</p>
        <p className="mt-3 text-lg">{vehicle.tagline}</p>
      </header>
      <figure className="mt-6 overflow-hidden rounded-2xl border border-line">
        <VehicleVisual vehicle={vehicle} priority />
        <figcaption className="bg-card px-4 py-2 text-xs text-muted">
          {image ? (
            <>
              사진: {image.author} ·{" "}
              <a href={image.page} className="underline underline-offset-2 hover:text-accent" target="_blank" rel="noopener noreferrer">
                위키미디어 공용
              </a>{" "}
              · {image.license}
              {vehicle.imageNote ? ` · ${vehicle.imageNote}` : ""}
            </>
          ) : (
            vehicle.imageNote ?? "사진 준비 중"
          )}
        </figcaption>
      </figure>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-sm font-semibold text-accent">운영자와 함께한 차</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex gap-3"><dt className="w-16 shrink-0 text-muted">세대</dt><dd>{vehicle.generation}</dd></div>
            <div className="flex gap-3"><dt className="w-16 shrink-0 text-muted">연식</dt><dd>{vehicle.years}</dd></div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-muted">색상</dt>
              <dd className="flex items-center gap-2">
                <span className="inline-block h-3.5 w-3.5 rounded-full border border-line" style={{ background: vehicle.colorHex }} aria-hidden="true" />
                {vehicle.color}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-muted">신차가</dt>
              <dd>{vehicle.price ? `당시 기준 ${vehicle.price}` : vehicle.priceNote ?? "확인 불가"}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="text-sm font-semibold text-accent">주요 제원</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {vehicle.specs.map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-28 shrink-0 text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-8 space-y-4 leading-relaxed">
        {vehicle.story.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        {vehicle.price && vehicle.priceNote ? <p className="text-sm text-muted">{vehicle.priceNote}</p> : null}
      </section>

      <CoupangCard />

      <nav className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="이전·다음">
        {prev ? (
          <Link href={hrefFor(prev)} className="rounded-xl border border-line p-4 text-sm hover:border-accent">
            <span className="text-xs text-muted">← 더 비쌌던 차</span>
            <span className="mt-1 block font-medium">{prev.nameKo}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={hrefFor(next)} className="rounded-xl border border-line p-4 text-right text-sm hover:border-accent">
            <span className="text-xs text-muted">다음 차 →</span>
            <span className="mt-1 block font-medium">{next.nameKo}</span>
          </Link>
        ) : null}
      </nav>
    </main>
  );
}
