import { getImage } from "@/lib/catalog";
import type { Vehicle } from "@/lib/types";

export function VehicleVisual({ vehicle, priority = false, className = "" }: { vehicle: Vehicle; priority?: boolean; className?: string }) {
  const image = getImage(vehicle.slug);
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        width={image.w}
        height={image.h}
        alt={`${vehicle.nameKo} 사진`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`aspect-[3/2] w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${vehicle.nameKo} 그래픽`}
      className={`relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden bg-hero ${className}`}
    >
      <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 30% 30%, ${vehicle.colorHex}, transparent 60%)` }} />
      <div className="relative text-center text-hero-ink">
        <p className="text-5xl" aria-hidden="true">{vehicle.kind === "car" ? "🚗" : "🛵"}</p>
        <p className="mt-2 font-serif text-lg">{vehicle.nameEn}</p>
        <p className="mt-1 text-xs opacity-70">사진 준비 중</p>
      </div>
    </div>
  );
}
