import {
  formatFare,
  letzUrl,
  yandexGoUrl,
  yandexGoWebUrl,
} from "@/lib/taxi";

interface TaxiButtonsProps {
  lat: number;
  lng: number;
  name: string;
  fareMin: number;
  fareMax: number;
}

export function TaxiButtons({ lat, lng, name, fareMin, fareMax }: TaxiButtonsProps) {
  const fare = formatFare(fareMin, fareMax);

  return (
    <section className="space-y-3">
      <p className="text-center text-xs text-amber-500/80">{fare}</p>
      <a
        href={yandexGoUrl(lat, lng)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 py-4 text-lg font-semibold text-stone-950 transition hover:bg-amber-400"
      >
        Call Taxi — Yandex Go
      </a>
      <a
        href={yandexGoWebUrl(lat, lng)}
        className="flex w-full items-center justify-center rounded-xl border border-amber-800/50 py-2 text-sm text-amber-400/90"
      >
        Yandex Go (browser fallback)
      </a>
      <a
        href={letzUrl(lat, lng, name)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-amber-500/60 bg-stone-900/80 py-4 text-lg font-semibold text-amber-100 transition hover:border-amber-400"
      >
        Call Taxi — Letz / Maps
      </a>
      <p className="text-center text-[10px] text-stone-500">
        Estimated fare shown to avoid overcharging. Final price set by the app.
      </p>
    </section>
  );
}
