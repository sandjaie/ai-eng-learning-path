import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/app/actions";

export function AppShell({
  brand = "AI Path",
  children,
  sidebar,
  rail,
}: {
  brand?: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  rail?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="grid min-h-screen lg:grid-cols-[248px_minmax(0,1fr)_310px]">
        <aside className="border-line bg-sidebar border-b px-5 py-7 lg:border-r lg:border-b-0">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-navy text-sm text-on-navy">
                AP
              </span>
              <span>{brand}</span>
            </Link>
            <ThemeToggle />
          </div>
          {sidebar}
          <form action={signOut} className="mt-8">
            <button type="submit" className="scc-btn scc-btn-secondary w-full text-sm">
              Sign out
            </button>
          </form>
        </aside>

        <main className="min-w-0 px-5 py-7 sm:px-8">{children}</main>

        {rail ? (
          <aside className="border-line bg-rail border-t px-5 py-7 lg:border-t-0 lg:border-l">
            {rail}
          </aside>
        ) : (
          <div className="hidden lg:block" />
        )}
      </div>
    </div>
  );
}
