import type { CulinaryItem } from "@/lib/types";
import { AudioPronunciation } from "@/components/AudioPronunciation";

interface CulinarySectionProps {
  items: CulinaryItem[];
}

export function CulinarySection({ items }: CulinarySectionProps) {
  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-amber-900/40 bg-stone-900/90 p-4 backdrop-blur-sm">
      <h2 className="font-serif text-xl text-amber-100">Premium Culinary Guide</h2>
      <p className="mt-1 text-xs text-stone-400">
        What to order, what to avoid — local expertise only.
      </p>
      <ul className="mt-4 space-y-5">
        {items.map((item) => (
          <li key={item.id} className="border-t border-stone-800 pt-4 first:border-0 first:pt-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-amber-50">{item.dish_name_en}</h3>
                <p className="text-xs text-amber-600/70">{item.dish_name_ro}</p>
              </div>
              <AudioPronunciation src={item.audio_path} label={item.dish_name_ro} />
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="font-medium text-emerald-400/90">Order: </span>
                <span className="text-stone-300">{item.order_this}</span>
              </p>
              <p>
                <span className="font-medium text-red-400/80">Avoid: </span>
                <span className="text-stone-400">{item.avoid_this}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
