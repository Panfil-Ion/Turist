import { createAdminClient } from "@/lib/supabase/admin";
import {
  FALLBACK_CULINARY,
  FALLBACK_LOCATIONS,
} from "@/lib/data/fallback";
import { canAccessLocation } from "@/lib/access";
import type {
  CulinaryItem,
  Location,
  LocationWithAccess,
  User,
} from "@/lib/types";

function mapLocation(row: Record<string, unknown>): Location {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name_ro: row.name_ro as string,
    name_en: row.name_en as string,
    description_en: row.description_en as string,
    lat: Number(row.lat),
    lng: Number(row.lng),
    category: row.category as Location["category"],
    weather_exposure: row.weather_exposure as Location["weather_exposure"],
    is_free_tier: row.is_free_tier as boolean,
    video_path: row.video_path as string,
    thumb_path: (row.thumb_path as string) ?? null,
    zone_key: row.zone_key as string,
    sort_order: row.sort_order as number,
    taxi_fare_min: row.taxi_fare_min as number,
    taxi_fare_max: row.taxi_fare_max as number,
    is_active: row.is_active as boolean,
  };
}

export async function fetchAllLocations(zone?: string): Promise<Location[]> {
  const admin = createAdminClient();

  if (!admin) {
    const list = [...FALLBACK_LOCATIONS];
    if (zone) return list.filter((l) => l.zone_key === zone || zone === "all");
    return list;
  }

  let query = admin
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (zone && zone !== "all") {
    query = query.eq("zone_key", zone);
  }

  const { data, error } = await query;
  if (error || !data?.length) {
    return zone
      ? FALLBACK_LOCATIONS.filter((l) => l.zone_key === zone)
      : FALLBACK_LOCATIONS;
  }

  return data.map(mapLocation);
}

export async function fetchLocationBySlug(
  slug: string
): Promise<Location | null> {
  const admin = createAdminClient();

  if (!admin) {
    return FALLBACK_LOCATIONS.find((l) => l.slug === slug) ?? null;
  }

  const { data, error } = await admin
    .from("locations")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return FALLBACK_LOCATIONS.find((l) => l.slug === slug) ?? null;
  }

  return mapLocation(data);
}

export async function fetchCulinaryForLocation(
  locationId: string,
  slug: string
): Promise<CulinaryItem[]> {
  const admin = createAdminClient();

  if (!admin) {
    return FALLBACK_CULINARY[slug] ?? [];
  }

  const { data, error } = await admin
    .from("culinary_items")
    .select("*")
    .eq("location_id", locationId)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return FALLBACK_CULINARY[slug] ?? [];
  return data as CulinaryItem[];
}

export function withAccessFlags(
  locations: Location[],
  user: User | null
): LocationWithAccess[] {
  return locations.map((loc) => ({
    ...loc,
    locked: !canAccessLocation(loc, user),
  }));
}
