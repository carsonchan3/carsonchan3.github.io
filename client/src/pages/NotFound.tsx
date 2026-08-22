import { ArrowLeft, Home, MoveUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <header className="vli-site-header border-b">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center transition-opacity hover:opacity-75" aria-label="Back to Velocity Lab Innovation home">
            <img
              src="/manus-storage/vli_logo_with_text_bb6773ef.png"
              alt="Velocity Lab Innovation"
              className="vli-brand-logo"
            />
          </a>
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--paper)] transition-colors hover:text-accent">
            <ArrowLeft size={16} /> Back to home
          </a>
        </div>
      </header>

      <main className="relative flex min-h-[calc(100vh-4rem)] items-center py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(64,224,208,0.17),transparent_0_28%),radial-gradient(circle_at_10%_82%,rgba(64,224,208,0.08),transparent_0_26%)]" />
        <div data-reveal className="container reveal-up relative">
          <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <div className="mb-6 h-1 w-12 bg-accent" />
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">404 · Lost flight path</p>
              <h1 className="velocity-headline mb-6 max-w-3xl text-white">
                This route is outside the <span className="text-accent">competition boundary.</span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-white/70">
                The page you are looking for is unavailable, has moved, or never existed. Return to Velocity Lab Innovation to explore precision-driven sports technology.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90">
                  <Home size={18} /> Return home
                </a>
                <a href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 px-6 py-3 font-semibold text-white transition-colors hover:border-accent hover:bg-accent hover:text-black">
                  Request a demo <MoveUpRight size={18} />
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-7 backdrop-blur-sm md:p-10">
              <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">System status</span>
                <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">Route unavailable</span>
              </div>
              <div className="text-[clamp(7rem,18vw,14rem)] font-bold leading-none tracking-[-0.08em] text-white/10">404</div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Status</p>
                  <p className="mt-2 text-sm text-white/70">No active page at this location.</p>
                </div>
                <div className="rounded-md border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Next step</p>
                  <p className="mt-2 text-sm text-white/70">Return to the main navigation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
