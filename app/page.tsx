import Link from "next/link";
import { CoupangCard } from "@/components/CoupangCard";
import { JsonLd } from "@/components/JsonLd";
import { VehicleGrid } from "@/components/VehicleGrid";
import { bikes, cars, hrefFor } from "@/lib/catalog";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export default function HomePage() {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${SITE_NAME} — 운영자와 함께했던 차량 및 바이크`,
          itemListElement: [...cars, ...bikes].map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: v.nameKo,
            url: absoluteUrl(hrefFor(v)),
          })),
        }}
      />
      <section className="bg-hero text-hero-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-xs tracking-[0.25em] text-accent-soft uppercase">Nadoo Car · Garage</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">나두카&amp;모터사이클</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed opacity-90">
            운영자와 함께했던 차량 및 바이크. 자동차 {cars.length}대와 모터사이클 {bikes.length}대를 당시 신차가가 높은 순서대로
            세웠습니다. 세대와 연식, 제원, 그리고 우리가 탔던 색까지 기록했습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a href="#cars" className="rounded-full bg-accent px-4 py-2 font-medium text-on-accent hover:opacity-90">자동차 {cars.length}대</a>
            <a href="#bikes" className="rounded-full border border-hero-ink/30 px-4 py-2 hover:border-accent-soft">모터사이클 {bikes.length}대</a>
          </div>
        </div>
      </section>

      <section id="cars" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold md:text-3xl">자동차</h2>
            <p className="mt-1 text-sm text-muted">당시 국내 신차가 기준, 비쌌던 차부터</p>
          </div>
          <Link href="/cars" className="shrink-0 text-sm text-accent hover:underline">목록만 보기 →</Link>
        </div>
        <VehicleGrid list={cars} />
      </section>

      <div className="px-4">
        <CoupangCard />
      </div>

      <section id="bikes" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold md:text-3xl">모터사이클</h2>
            <p className="mt-1 text-sm text-muted">당시 국내 신차가 기준, 비쌌던 바이크부터</p>
          </div>
          <Link href="/bikes" className="shrink-0 text-sm text-accent hover:underline">목록만 보기 →</Link>
        </div>
        <VehicleGrid list={bikes} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <p className="rounded-2xl border border-line bg-card p-5 text-sm leading-relaxed text-muted">
          신차가는 각 세대가 국내에 출시될 때 발표된 가격을 바탕으로 한 대략적인 금액이며, 물가 상승은 반영하지 않았습니다. 트림을
          알 수 없는 차는 해당 세대의 가격대로 적었고, 자료를 찾지 못한 차는 금액을 적지 않고 추정치로만 순서를 정했습니다.
        </p>
      </section>
    </main>
  );
}
