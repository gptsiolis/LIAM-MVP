"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PayBanner } from "@/components/PayBanner";
import { MintedCardsFeed, type Supporter } from "@/components/MintedCardsFeed";
import { AuthModal, type FakeUser } from "@/components/AuthModal";
import { MintSuccessModal } from "@/components/MintSuccessModal";
import { computeTiers } from "@/lib/tiers";
import type { TierSlug } from "@/components/CardBadge";

// Demo video
const DEMO_VIDEO = {
  title: "The Crossing — A Short Film",
  creatorName: "Ava Chen",
  embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
};

// Seed supporters (will have tiers recomputed dynamically)
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

/**
 * Given raw supporters (without tiers), compute tiers for all of them
 * using the real percentile-based logic.
 */
function withComputedTiers(raw: Omit<Supporter, "tier">[]): Supporter[] {
  const amounts = raw.map((s) => s.amountCents);
  const tiers = computeTiers(amounts);
  return raw.map((s, i) => ({ ...s, tier: tiers[i].slug as TierSlug }));
}

export default function Home() {
  // Auth state
  const [user, setUser] = useState<FakeUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Supporters state (raw, without tiers — tiers computed on render)
  const [rawSupporters, setRawSupporters] = useState<Omit<Supporter, "tier">[]>(SEED_SUPPORTERS);

  // Mint success modal state
  const [mintResult, setMintResult] = useState<{
    amountCents: number;
    tierSlug: TierSlug;
    tierName: string;
  } | null>(null);

  // Compute tiers for all supporters (recomputed every render when list changes)
  const supporters = withComputedTiers(rawSupporters);

  // Handle contribution
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

      // Add new supporter to front of list
      const updatedRaw = [newSupporter, ...rawSupporters];
      setRawSupporters(updatedRaw);

      // Compute tiers for the updated list to find this user's tier
      const allTiers = computeTiers(updatedRaw.map((s) => s.amountCents));
      const myTier = allTiers[0]; // new supporter is at index 0

      // Show success modal
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

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        {/* Hero: Video + Pay Banner — figure-dominant layout */}
        <section className="flex flex-col gap-6 lg:flex-row">
          {/* Video (9-col equivalent) */}
          <div className="w-full lg:w-3/4">
            <VideoPlayer
              title={DEMO_VIDEO.title}
              embedUrl={DEMO_VIDEO.embedUrl}
            />
            {/* Creator info under video */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-liam-black text-xs font-bold text-white">
                A
              </div>
              <div>
                <p className="text-sm font-bold">{DEMO_VIDEO.creatorName}</p>
                <p className="text-xs text-muted-foreground">
                  Director &middot; {supporters.length} supporter{supporters.length !== 1 && "s"}
                </p>
              </div>
            </div>
          </div>

          {/* Pay Banner (3-col sidebar) */}
          <div className="w-full lg:w-1/4">
            <PayBanner
              videoTitle={DEMO_VIDEO.title}
              creatorName={DEMO_VIDEO.creatorName}
              isLoggedIn={!!user}
              onContribute={handleContribute}
              onAuthRequired={() => setAuthModalOpen(true)}
            />
          </div>
        </section>

        {/* Minted Cards Feed */}
        <section className="mt-10">
          <MintedCardsFeed supporters={supporters} />
        </section>
      </main>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuth={setUser}
      />

      {/* Mint Success Modal */}
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
