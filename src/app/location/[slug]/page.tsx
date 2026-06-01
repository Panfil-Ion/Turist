import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { VideoBackground } from "@/components/VideoBackground";
import { TaxiButtons } from "@/components/TaxiButtons";
import { CulinarySection } from "@/components/CulinarySection";
import {
  fetchCulinaryForLocation,
  fetchLocationBySlug,
} from "@/lib/locations";
import { canAccessLocation } from "@/lib/access";
import { getCurrentUser, getVisitorId, getOrCreateUser } from "@/lib/visitor";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = await fetchLocationBySlug(slug);

  if (!location) notFound();

  let user = await getCurrentUser();
  const visitorId = await getVisitorId();
  if (!user && visitorId) {
    user = await getOrCreateUser(visitorId);
  }

  if (!canAccessLocation(location, user)) {
    redirect(`/unlock?from=${slug}`);
  }

  const culinary = await fetchCulinaryForLocation(location.id, slug);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <VideoBackground src={location.video_path} poster={location.thumb_path} />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/30" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="p-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-stone-950/60 px-3 py-1.5 text-sm text-amber-200 backdrop-blur"
          >
            ← Back
          </Link>
        </div>

        <div className="mt-auto space-y-4 p-4 pb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-500/80">
              {location.name_ro}
            </p>
            <h1 className="font-serif text-3xl text-amber-50">{location.name_en}</h1>
            <p className="mt-2 text-sm text-stone-300">{location.description_en}</p>
          </div>

          <TaxiButtons
            lat={location.lat}
            lng={location.lng}
            name={location.name_en}
            fareMin={location.taxi_fare_min}
            fareMax={location.taxi_fare_max}
          />

          <CulinarySection items={culinary} />
        </div>
      </div>
    </div>
  );
}
