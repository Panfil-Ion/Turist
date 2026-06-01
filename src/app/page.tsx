import { Header } from "@/components/Header";
import { LocationCard } from "@/components/LocationCard";
import { fetchAllLocations, withAccessFlags } from "@/lib/locations";
import { getCurrentUser, getVisitorId, getOrCreateUser } from "@/lib/visitor";
import { getWeatherMode, filterLocationsByWeather } from "@/lib/weather";
import { hasActivePass } from "@/lib/access";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const zone = "chisinau";

  let user = await getCurrentUser();
  const visitorId = await getVisitorId();
  if (!user && visitorId) {
    user = await getOrCreateUser(visitorId);
  }

  const [locations, mode] = await Promise.all([
    fetchAllLocations(zone),
    getWeatherMode(zone),
  ]);

  const withAccess = withAccessFlags(locations, user);
  const { outdoor, rainyDay } = filterLocationsByWeather(locations, mode);

  const outdoorSlugs = new Set(outdoor.map((l) => l.slug));
  const mainList =
    mode === "rainy"
      ? withAccess.filter((l) => outdoorSlugs.has(l.slug))
      : withAccess;

  const rainyList =
    mode === "rainy" ? withAccessFlags(rainyDay, user) : [];

  return (
    <>
      <Header hasPass={hasActivePass(user)} />
      <main className="mx-auto max-w-lg px-4 pb-12 pt-6">
        <section className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-500">
            Republic of Moldova
          </p>
          <h1 className="mt-2 font-serif text-3xl text-amber-50">
            Your Premium Explorer
          </h1>
          <p className="mt-3 text-sm text-stone-400">
            Scan at your hotel — 3 destinations free. Full access for 14 days with
            one payment.
          </p>
        </section>

        {mode === "rainy" && (
          <section className="mb-6 rounded-2xl border border-sky-900/50 bg-sky-950/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Weather alert
            </p>
            <p className="mt-1 text-sm text-stone-300">
              Rain detected in {zone}. Outdoor parks are hidden — explore indoor
              picks below.
            </p>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wider text-amber-600/80">
            {mode === "rainy" ? "Available today" : "Destinations"}
          </h2>
          {mainList.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </section>

        {rainyList.length > 0 && (
          <section className="mt-10 space-y-3">
            <h2 className="font-serif text-xl text-amber-100">Zi Ploioasă</h2>
            <p className="text-xs text-stone-500">
              Wineries, museums & galleries — perfect for a rainy day.
            </p>
            {rainyList.map((loc) => (
              <LocationCard key={`rainy-${loc.id}`} location={loc} />
            ))}
          </section>
        )}

        {!hasActivePass(user) && (
          <section className="mt-10 rounded-2xl border border-amber-800/40 bg-gradient-to-b from-amber-950/40 to-stone-950 p-6 text-center">
            <h2 className="font-serif text-xl text-amber-100">
              14-Day Full Explorer Pass
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              One-time €5 — all destinations, taxi links & culinary guides.
            </p>
            <Link
              href="/unlock"
              className="mt-4 inline-block rounded-2xl bg-amber-500 px-8 py-3 font-semibold text-stone-950"
            >
              Unlock now
            </Link>
          </section>
        )}
      </main>
    </>
  );
}
