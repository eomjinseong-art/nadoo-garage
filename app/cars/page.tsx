import { VehicleGrid } from "@/components/VehicleGrid";
import { cars } from "@/lib/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "자동차",
  description: "운영자와 함께했던 자동차 " + cars.length + "대를 당시 신차가가 높은 순서대로 정리했습니다.",
  path: "/cars",
});

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">자동차</h1>
      <p className="mt-2 mb-8 text-muted">운영자와 함께했던 자동차 {cars.length}대 · 당시 국내 신차가가 높은 순</p>
      <VehicleGrid list={cars} />
    </main>
  );
}
