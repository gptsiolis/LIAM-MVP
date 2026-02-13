"use client";

import { useState, useCallback, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PayBanner } from "@/components/PayBanner";
import { MintedCardsFeed, type Supporter } from "@/components/MintedCardsFeed";
import { AuthModal, type FakeUser } from "@/components/AuthModal";
import { MintSuccessModal } from "@/components/MintSuccessModal";
import { Countdown } from "@/components/Countdown";
import { Leaderboard } from "@/components/Leaderboard";
import { computeTiers } from "@/lib/tiers";
import type { TierSlug } from "@/components/CardBadge";
import { Separator } from "@/components/ui/separator";

// Demo video
const DEMO_VIDEO = {
  title: "The Crossing — A Short Film",
  creatorName: "Ava Chen",
  embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
};

// Contributions close 7 days from now
const CONTRIBUTIONS_END = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

// Seed supporters
const SEED_SUPPORTERS: Omit<Supporter, "tier">[] = [
  {
    id: "seed-1",
    username: "rileyj",
    displayName: "Riley J.",
    amountCents: 25000,
    message: "Instant classic. Supporting the movement.",
    timeAgo: "1h ago",
  },
  {
    id: "seed-2",
    username: "alexm",
    displayName: "Alex M.",
    amountCents: 10000,
    message: "This film changed my perspective",
    timeAgo: "2h ago",
  },
  {
    id: "seed-3",
    username: "jordank",
    displayName: "Jordan K.",
    amountCents: 2500,
    message: "Love the cinematography",
    timeAgo: "3h ago",
  },
  {
    id: "seed-4",
    username: "samw",
    displayName: "Sam W.",
    amountCents: 500,
    timeAgo: "5h ago",
  },
  {
    id: "seed-5",
    username: "taylorc",
    displayName: "Taylor C.",
    amountCents: 200,
    timeAgo: "8h ago",
  },
];

function withComputedTiers(raw: Omit<Supporter, "tier">[]): Supporter[] {
  const amounts = raw.map((s) => s.amountCents);
  const tiers = computeTiers(amounts);
  return raw.map((s, i) => ({ ...s, tier: tiers[i].slug as TierSlug }));
}

function formatTotal(cents: number): string {
  if (cents >= 100000) return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default function Home() {
  const [user, setUser] = useState<FakeUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [rawSupporters, setRawSupporters] =
    useState<Omit<Supporter, "tier">[]>(SEED_SUPPORTERS);
  const [mintResult, setMintResult] = useState<{
    amountCents: number;
    tierSlug: TierSlug;
    tierName: string;
  } | null>(null);

  const supporters = useMemo(() => withComputedTiers(rawSupporters), [rawSupporters]);

  const totalRaised = useMemo(
    () => rawSupporters.reduce((sum, s) => sum + s.amountCents, 0),
    [rawSupporters]
  );

  const handleContribute = useCallback(
    (amountCents: number, message: string) => {
      if (!user) return;

      const newSupporter: Omit<Supporter, "tier"> = {
        id: `mint-${Date.now()}`,
        username: user.username,
        displayName: user.displayName,
        amountCents,
        message: message || undefined,
        timeAgo: "just now",
      };

      const updatedRaw = [newSupporter, ...rawSupporters];
      setRawSupporters(updatedRaw);

      const allTiers = computeTiers(updatedRaw.map((s) => s.amountCents));
      const myTier = allTiers[0];

      setMintResult({
        amountCents,
        tierSlug: myTier.slug as TierSlug,
        tierName: myTier.name,
      });
    },
    [user, rawSupporters]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        user={user}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={() => setUser(null)}
      />

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero: Video + Pay Banner */}
        <section className="flex flex-col gap-6 lg:flex-row">
          {/* Video (figure-dominant) */}
          <div className="w-full lg:w-3/4">
            <VideoPlayer
              title={DEMO_VIDEO.title}
              embedUrl={DEMO_VIDEO.embedUrl}
            />

            {/* Creator info */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-liam-black text-sm font-bold text-white">
                  A
                </div>
                <div>
                  <p className="text-sm font-bold">{DEMO_VIDEO.creatorName}</p>
                  <p className="text-xs text-muted-foreground">
                    Director &middot; {supporters.length} supporter{supporters.length !== 1 && "s"}
                  </p>
                </div>
              </div>
              <button className="text-xs font-bold text-secondary transition-opacity hover:opacity-80">
                See all films by this creator &rarr;
              </button>
            </div>

            {/* Stats bar */}
            <div className="mt-4 flex items-center gap-6 rounded-lg bg-muted/50 px-4 py-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Total Raised
                </p>
                <p className="text-lg font-extrabold">{formatTotal(totalRaised)}</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Supporters
                </p>
                <p className="text-lg font-extrabold">{supporters.length}</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Cards Minted
                </p>
                <p className="text-lg font-extrabold">{supporters.length}</p>
              </div>
            </div>
          </div>

          {/* Sidebar: Pay Banner + Countdown */}
          <div className="flex w-full flex-col gap-4 lg:w-1/4">
            <PayBanner
              videoTitle={DEMO_VIDEO.title}
              creatorName={DEMO_VIDEO.creatorName}
              isLoggedIn={!!user}
              onContribute={handleContribute}
              onAuthRequired={() => setAuthModalOpen(true)}
            />
            <Countdown endDate={CONTRIBUTIONS_END} />
          </div>
        </section>

        <Separator className="my-8" />

        {/* Two-column: Leaderboard + Feed */}
        <section className="flex flex-col gap-8 lg:flex-row">
          {/* Leaderboard (sidebar) */}
          <div className="w-full lg:w-1/3">
            <Leaderboard supporters={supporters} />
          </div>

          {/* Recent supporters feed */}
          <div className="w-full lg:w-2/3">
            <MintedCardsFeed supporters={supporters} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-muted/30 px-4 py-6 text-center">
        <p className="text-sm font-bold text-primary-foreground">LIAM</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Videos you can keep. No ads. Pay what you want. Earn a card.
        </p>
      </footer>

      {/* Modals */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuth={setUser}
      />

      {mintResult && (
        <MintSuccessModal
          open={!!mintResult}
          onOpenChange={(open) => {
            if (!open) setMintResult(null);
          }}
          videoTitle={DEMO_VIDEO.title}
          amountCents={mintResult.amountCents}
          tierSlug={mintResult.tierSlug}
          tierName={mintResult.tierName}
          displayName={user?.displayName ?? ""}
        />
      )}
    </div>
  );
}
