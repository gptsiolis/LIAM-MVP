export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar stub */}
      <nav className="flex items-center justify-between bg-primary px-6 py-3">
        <span className="text-2xl font-extrabold tracking-tight text-primary-foreground">
          LIAM
        </span>
        <div className="flex items-center gap-6 text-sm font-bold text-primary-foreground">
          <span>Explore</span>
          <span>Collection</span>
          <button className="rounded-md bg-liam-black px-4 py-2 text-xs font-bold text-white">
            Log In
          </button>
        </div>
      </nav>

      {/* Hero section placeholder */}
      <main className="mx-auto max-w-[1200px] px-6 py-12">
        <section className="flex flex-col gap-8 lg:flex-row">
          {/* Video placeholder (9-col figure-dominant) */}
          <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-liam-black lg:w-3/4">
            <span className="text-lg font-bold text-white">
              Video Player Placeholder
            </span>
          </div>

          {/* Pay banner placeholder (3-col sidebar) */}
          <div className="flex w-full flex-col gap-4 rounded-lg border border-border bg-card p-6 lg:w-1/4">
            <h2 className="text-xl font-bold">Pay What You Want</h2>
            <p className="text-sm text-muted-foreground">
              No ads. Pay what you want. Earn a card.
            </p>
            <div className="flex gap-2">
              {[2, 5, 10, 25].map((amt) => (
                <button
                  key={amt}
                  className="rounded-md border border-border px-3 py-1.5 text-sm font-bold transition-colors hover:bg-accent"
                >
                  ${amt}
                </button>
              ))}
            </div>
            <button className="mt-2 w-full rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-liam-yellow-light">
              Contribute
            </button>
          </div>
        </section>

        {/* Recent supporters placeholder */}
        <section className="mt-12">
          <h3 className="mb-4 text-lg font-bold">Recent Supporters</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Alex M.", amount: 25, tier: "Green", color: "bg-tier-green" },
              { name: "Jordan K.", amount: 10, tier: "Brown", color: "bg-tier-brown" },
              { name: "Sam W.", amount: 100, tier: "Red", color: "bg-tier-red" },
            ].map((supporter) => (
              <div
                key={supporter.name}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                  {supporter.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{supporter.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ${supporter.amount} &middot; {supporter.tier}
                  </p>
                </div>
                <span
                  className={`h-3 w-3 rounded-full ${supporter.color}`}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
