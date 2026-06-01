import { NextRequest, NextResponse } from "next/server";
import { fetchAllLocations, withAccessFlags } from "@/lib/locations";
import { getCurrentUser, getVisitorId, getOrCreateUser } from "@/lib/visitor";
import { getWeatherMode, filterLocationsByWeather } from "@/lib/weather";
import { hasActivePass } from "@/lib/access";

export async function GET(request: NextRequest) {
  const zone = request.nextUrl.searchParams.get("zone") ?? "chisinau";

  let user = await getCurrentUser();
  const visitorId = await getVisitorId();
  if (!user && visitorId) {
    user = await getOrCreateUser(visitorId);
  }

  const [locations, mode] = await Promise.all([
    fetchAllLocations(zone === "all" ? undefined : zone),
    getWeatherMode(zone),
  ]);

  const withAccess = withAccessFlags(locations, user);
  const { outdoor, rainyDay } = filterLocationsByWeather(locations, mode);

  const outdoorSlugs = new Set(outdoor.map((l) => l.slug));
  const filtered = withAccess.filter((l) => outdoorSlugs.has(l.slug));
  const rainyWithAccess = withAccessFlags(rainyDay, user);

  return NextResponse.json({
    zone,
    mode,
    hasPass: hasActivePass(user),
    locations: mode === "rainy" ? filtered : withAccess,
    rainyDay: mode === "rainy" ? rainyWithAccess : [],
  });
}
