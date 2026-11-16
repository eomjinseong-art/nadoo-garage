import { VehicleCard } from "@/components/VehicleCard";
import type { Vehicle } from "@/lib/types";
import { CoupangCard } from "@/components/CoupangCard";

export function VehicleGrid({ list }: { list: Vehicle[] }) {
  const mid = Math.min(9, Math.max(1, Math.floor(list.length / 2)));
  return (
    <>
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, mid).map((v, i) => (
          <li key={v.slug}>
            <VehicleCard vehicle={v} rank={i + 1} />
          </li>
        ))}
      </ol>
      {list.length > 0 ? <CoupangCard /> : null}
      <ol className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(mid).map((v, i) => (
          <li key={v.slug}>
            <VehicleCard vehicle={v} rank={mid + i + 1} />
          </li>
        ))}
      </ol>
    </>
  );
}
