import Link from "next/link";

interface HeaderProps {
  hasPass?: boolean;
}

export function Header({ hasPass }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/20 bg-[#0c0a09]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/" className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-500/80">
            Moldova
          </span>
          <span className="font-serif text-lg text-amber-50">Explorer</span>
        </Link>
        {hasPass ? (
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            Full Pass Active
          </span>
        ) : (
          <Link
            href="/unlock"
            className="rounded-full border border-amber-500/50 px-3 py-1 text-xs font-medium text-amber-400 transition hover:bg-amber-500/10"
          >
            Unlock — €5
          </Link>
        )}
      </div>
    </header>
  );
}
