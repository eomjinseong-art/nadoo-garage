import Link from "next/link";
import { VehicleVisual } from "@/components/VehicleVisual";
import { hrefFor } from "@/lib/catalog";
import type { Vehicle } from "@/lib/types";

export function VehicleCard({ vehicle, rank }: { vehicle: Vehicle; rank: number }) {
  return (
    <Link
      href={hrefFor(vehicle)}
      data-vehicle={vehicle.slug}
      className="group block overflow-hidden rounded-2xl border border-line bg-card transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
    >
      <div className="relative">
        <VehicleVisual vehicle={vehicle} />
        <span className="absolute top-3 left-3 rounded-full bg-hero/80 px-2.5 py-1 text-xs font-semibold text-hero-ink tabular-nums">
          {String(rank).padStart(2, "0")}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs text-accent">{vehicle.brand} · {vehicle.generation}</p>
        <h3 className="mt-1 font-serif text-lg leading-snug group-hover:text-accent">{vehicle.nameKo}</h3>
        <p className="mt-1 text-sm text-muted">{vehicle.tagline}</p>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span className="inline-block h-3 w-3 rounded-full border border-line" style={{ background: vehicle.colorHex }} aria-hidden="true" />
          함께한 색: {vehicle.color}
        </p>
        <p className="mt-1 text-xs text-muted">{vehicle.price ? `신차가 당시 기준 ${vehicle.price}` : "신차가 자료 확인 불가"}</p>
      </div>
    </Link>
  );
}
