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
      aria-label={`${vehicle.nameKo} ${vehicle.color} 그래픽`}
      className={`relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: "linear-gradient(160deg, #e9e7e2 0%, #cfccc5 100%)" }}
    >
      <div className="relative text-center text-neutral-800">
        {vehicle.kind === "bike" ? (
          <svg viewBox="0 0 220 140" className="mx-auto h-28 w-auto drop-shadow-md sm:h-36" aria-hidden="true">
            <g stroke="#2b2b2b" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
              <circle cx="52" cy="108" r="22" fill="#2b2b2b" />
              <circle cx="52" cy="108" r="9" fill="#bdbdbd" />
              <circle cx="172" cy="108" r="22" fill="#2b2b2b" />
              <circle cx="172" cy="108" r="9" fill="#bdbdbd" />
              <path d="M28 98 C30 72 52 62 80 64 L118 64 C122 82 128 92 146 92 L150 64 L160 40 L170 40 L186 92 C190 100 186 104 178 102 L162 98 C150 104 118 104 96 102 L40 104 Z" fill={vehicle.colorHex} />
              <path d="M56 64 C60 50 76 46 104 48 L112 64 Z" fill="#3a3a3a" />
              <path d="M158 40 L150 22 M146 22 L170 22" fill="none" />
              <circle cx="176" cy="54" r="7" fill="#fff6c8" />
            </g>
          </svg>
        ) : (
          <p className="text-5xl" aria-hidden="true">🚗</p>
        )}
        <p className="mt-2 font-serif text-lg">{vehicle.nameEn}</p>
        <p className="mt-1 text-xs opacity-70">{vehicle.color} · 사진 준비 중</p>
      </div>
    </div>
  );
}
