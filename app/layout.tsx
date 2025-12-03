import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VCA Virtual Coach",
  description:
    "Virtual Coach AI – golf coaching powered by AI plus Jim Hartnett-style priorities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-emerald-950 flex flex-col">
          {/* Top navigation */}
          <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-xs font-bold text-slate-950">
                  VC
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">VCA Virtual Coach</p>
                  <p className="text-[10px] text-slate-400">
                    AI + real coaching influence
                  </p>
                </div>
              </Link>

              {/* Nav links */}
              <nav className="flex items-center gap-4 text-xs text-slate-300">
                <Link href="/" className="hover:text-emerald-300">
                  Home
                </Link>
                <Link href="/coach" className="hover:text-emerald-300">
                  AI Coach
                </Link>
                <Link href="/upload" className="hover:text-emerald-300">
                  Upload Swing
                </Link>
                <Link href="/report" className="hover:text-emerald-300">
                  Sample Report
                </Link>
                <Link href="/about" className="hover:text-emerald-300">
                  About
                </Link>
              </nav>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-slate-800/80 py-3 text-center text-[10px] text-slate-500">
            © {new Date().getFullYear()} VCA Virtual Coach · AI + Jim
            Hartnett–style priorities, influenced by top coaching and
            biomechanics.
          </footer>
        </div>
      </body>
    </html>
  );
}
