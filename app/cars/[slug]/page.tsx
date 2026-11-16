import { notFound } from "next/navigation";
import { VehicleDetail } from "@/components/VehicleDetail";
import { cars, getImage, getVehicle } from "@/lib/catalog";
import { pageMetadata } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cars.map((v) => ({ slug: v.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const v = getVehicle("car", slug);
  if (!v) return {};
  return pageMetadata({
    title: v.nameKo,
    description: `${v.nameKo}(${v.years}) — ${v.tagline}. 운영자와 함께한 ${v.color} ${v.nameKo}의 세대, 제원, 당시 신차가.`,
    path: `/cars/${v.slug}`,
    image: getImage(v.slug)?.src,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const v = getVehicle("car", slug);
  if (!v) notFound();
  return <VehicleDetail vehicle={v} />;
}
