import images from "@/data/images.json";
import { bikes as rawBikes } from "@/data/bikes";
import { cars as rawCars } from "@/data/cars";
import type { Vehicle, WikiImage } from "@/lib/types";

const byPrice = (a: Vehicle, b: Vehicle) => b.priceSort - a.priceSort;

export const cars = [...rawCars].sort(byPrice);
export const bikes = [...rawBikes].sort(byPrice);
export const vehicles = [...cars, ...bikes];

export function getVehicle(kind: Vehicle["kind"], slug: string) {
  return (kind === "car" ? cars : bikes).find((v) => v.slug === slug);
}

export function getImage(slug: string): WikiImage | undefined {
  return (images as Record<string, WikiImage>)[slug];
}

export function hrefFor(v: Vehicle) {
  return `/${v.kind === "car" ? "cars" : "bikes"}/${v.slug}`;
}

export function rankOf(v: Vehicle) {
  return (v.kind === "car" ? cars : bikes).findIndex((x) => x.slug === v.slug) + 1;
}
