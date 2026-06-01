import Link from "next/link";
import type { LocationWithAccess } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  park: "Park",
  museum: "Museum",
  winery: "Winery",
  gallery: "Gallery",
  restaurant: "Restaurant",
  landmark: "Landmark",
  other: "Spot",
};

interface LocationCardProps {
  location: LocationWithAccess;
}

export function LocationCard({ location }: LocationCardProps) {
  const href = location.locked ? "/unlock" : `/location/${location.slug}`;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-br from-stone-900 to-stone-950 p-4 transition hover:border-amber-600/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-amber-500/70">
            {CATEGORY_LABELS[location.category] ?? location.category}
          </p>
          <h3 className="mt-1 font-serif text-lg text-amber-50 group-hover:text-amber-200">
            {location.name_en}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-stone-400">
            {location.description_en}
          </p>
        </div>
        {location.is_free_tier && (
          <span className="shrink-0 rounded-full bg-emerald-900/50 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-300">
            Free
          </span>
        )}
        {location.locked && (
          <span className="shrink-0 rounded-full bg-stone-800 px-2 py-0.5 text-[10px] font-semibold uppercase text-stone-400">
            Locked
          </span>
        )}
      </div>
      <p className="mt-3 text-xs text-amber-600/80">
        Taxi est. {location.taxi_fare_min}–{location.taxi_fare_max} MDL
      </p>
    </Link>
  );
}
