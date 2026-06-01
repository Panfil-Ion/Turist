import Link from "next/link";
import { Header } from "@/components/Header";
import { UnlockButton } from "@/components/UnlockButton";
import { getCurrentUser } from "@/lib/visitor";
import { hasActivePass } from "@/lib/access";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ success?: string; canceled?: string; from?: string }>;
}

export default async function UnlockPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const active = hasActivePass(user);

  return (
    <>
      <Header hasPass={active} />
      <main className="mx-auto max-w-lg px-4 py-8">
        {params.success === "1" && active && (
          <div className="mb-6 rounded-2xl border border-emerald-800/50 bg-emerald-950/40 p-4 text-center text-emerald-300">
            Payment successful. Your 14-Day Full Explorer Pass is active.
          </div>
        )}

        {params.canceled === "1" && (
          <div className="mb-6 rounded-2xl border border-stone-700 bg-stone-900/50 p-4 text-center text-stone-400">
            Payment canceled. You can try again anytime.
          </div>
        )}

        <section className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
            Full Explorer Pass
          </p>
          <h1 className="mt-2 font-serif text-3xl text-amber-50">
            Unlock all of Moldova
          </h1>
          <p className="mt-4 text-stone-400">
            One payment of <strong className="text-amber-400">€5</strong> — 14 days
            of unlimited access. No daily calendar. No subscriptions.
          </p>
        </section>

        <ul className="mt-8 space-y-3 text-sm text-stone-300">
          <li className="flex gap-2">
            <span className="text-amber-500">✓</span> All premium destinations & video loops
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500">✓</span> Taxi deep-links with estimated fares
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500">✓</span> Rainy-day smart recommendations
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500">✓</span> Culinary guides + pronunciation audio
          </li>
        </ul>

        {active ? (
          <div className="mt-10 text-center">
            <p className="text-emerald-400">Your pass is already active.</p>
            <Link href="/" className="mt-4 inline-block text-amber-400 underline">
              Browse destinations
            </Link>
          </div>
        ) : (
          <div className="mt-10">
            <UnlockButton />
            {params.from && (
              <p className="mt-4 text-center text-xs text-stone-500">
                Unlock to view: {params.from.replace(/-/g, " ")}
              </p>
            )}
          </div>
        )}

        <p className="mt-8 text-center text-[10px] text-stone-600">
          First 3 base locations remain free forever.
        </p>
      </main>
    </>
  );
}
