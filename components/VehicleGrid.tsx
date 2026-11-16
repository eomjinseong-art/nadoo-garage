import { VehicleCard } from "@/components/VehicleCard";
import type { Vehicle } from "@/lib/types";

export function VehicleGrid({ list }: { list: Vehicle[] }) {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((v, i) => (
        <li key={v.slug}>
          <VehicleCard vehicle={v} rank={i + 1} />
        </li>
      ))}
    </ol>
  );
}
