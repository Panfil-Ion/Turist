import type { Location, WeatherMode } from "@/lib/types";

const ZONE_COORDS: Record<string, { lat: number; lon: number }> = {
  chisinau: { lat: 47.0105, lon: 28.8638 },
  orhei: { lat: 47.305, lon: 28.978 },
};

const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
]);

export async function getWeatherMode(zone: string): Promise<WeatherMode> {
  const coords = ZONE_COORDS[zone] ?? ZONE_COORDS.chisinau;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) return "clear";

  try {
    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.searchParams.set("lat", String(coords.lat));
    url.searchParams.set("lon", String(coords.lon));
    url.searchParams.set("appid", apiKey);
    url.searchParams.set("units", "metric");

    const res = await fetch(url.toString(), { next: { revalidate: 900 } });
    if (!res.ok) return "clear";

    const data = (await res.json()) as {
      weather?: { id: number }[];
      rain?: unknown;
      snow?: unknown;
    };

    const hasPrecip =
      Boolean(data.rain) ||
      Boolean(data.snow) ||
      (data.weather ?? []).some((w) => RAIN_CODES.has(w.id));

    return hasPrecip ? "rainy" : "clear";
  } catch {
    return "clear";
  }
}

const RAINY_CATEGORIES = new Set(["museum", "winery", "gallery", "restaurant"]);

export function filterLocationsByWeather(
  locations: Location[],
  mode: WeatherMode
): { outdoor: Location[]; rainyDay: Location[] } {
  if (mode === "clear") {
    return { outdoor: locations, rainyDay: [] };
  }

  const outdoor = locations.filter((l) => l.weather_exposure !== "outdoor");
  const rainyDay = locations.filter(
    (l) =>
      l.weather_exposure === "indoor" ||
      RAINY_CATEGORIES.has(l.category)
  );

  return { outdoor, rainyDay };
}
