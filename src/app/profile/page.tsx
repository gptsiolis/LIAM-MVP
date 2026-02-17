"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CardBadge, type TierSlug } from "@/components/CardBadge";
import { FlipCard } from "@/components/FlipCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AuthUser } from "@/components/AuthModal";
import { AuthModal } from "@/components/AuthModal";

interface VideoCardData {
  id: string;
  videoTitle: string;
  creatorName: string;
  amountCents: number;
  tier: TierSlug;
  mintedAt: string;
  message?: string | null;
}

interface CreatorCardData {
  id: string;
  creatorId: string;
  creatorName: string;
  year: number;
  totalAmountCents: number;
  tier: TierSlug;
}

interface ProfileData {
  user: {
    id: string;
    displayName: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    joinedAt: string;
  };
  videoCards: VideoCardData[];
  creatorCards: CreatorCardData[];
  stats: {
    totalCards: number;
    totalContributed: number;
    creatorsSupported: number;
  };
}

function formatAmount(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

// Fake friends' cards for the taste curation preview
const FAKE_FRIENDS_CARDS = [
  {
    friendName: "Aria Chen",
    friendUsername: "ariachen",
    videoTitle: "Echoes of Tomorrow — Short Film",
    creatorName: "Ean Shen",
    tier: "green" as TierSlug,
    amountCents: 5000,
  },
  {
    friendName: "James Park",
    friendUsername: "jpark",
    videoTitle: "The Last Garden — Documentary",
    creatorName: "Luna Park",
    tier: "green" as TierSlug,
    amountCents: 5000,
  },
  {
    friendName: "Kai Nakamura",
    friendUsername: "kainaka",
    videoTitle: "Neon Drift — Music Video",
    creatorName: "Ean Shen",
    tier: "grey" as TierSlug,
    amountCents: 500,
  },
];

const TIER_LABELS: Record<TierSlug, string> = {
  grey: "Grey",
  brown: "Brown",
  green: "Green",
  red: "Red",
  purple: "Purple",
  gold: "Gold",
};

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user, fetchProfile]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setProfile(null);
  };

  // --- Not logged in ---
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar onLoginClick={() => setAuthModalOpen(true)} />
        <main className="mx-auto flex max-w-[1200px] flex-col items-center justify-center px-4 py-24">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
            <svg
              className="h-10 w-10 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Your Collection</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to see your cards and contribution history.
          </p>
          <Button
            size="lg"
            className="mt-6 font-bold hover:bg-liam-yellow-light"
            onClick={() => setAuthModalOpen(true)}
          >
            Sign In to View Collection
          </Button>
        </main>
        <AuthModal
          open={authModalOpen}
          onOpenChange={setAuthModalOpen}
          onAuth={setUser}
        />
      </div>
    );
  }

  // --- Loading ---
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar
          user={user}
          onLoginClick={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
        />
        <main className="mx-auto flex max-w-[1200px] items-center justify-center px-4 py-24">
          <p className="text-sm text-muted-foreground">
            Loading your collection...
          </p>
        </main>
      </div>
    );
  }

  const { videoCards, creatorCards, stats } = profile;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        user={user}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
        {/* ====== PROFILE HEADER ====== */}
        <section className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <Avatar className="h-20 w-20 border-4 border-primary">
            <AvatarFallback className="bg-liam-black text-2xl font-bold text-white">
              {profile.user.displayName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center gap-3 sm:items-start">
            <div>
              <h1 className="text-2xl font-bold">
                {profile.user.displayName}
              </h1>
              <p className="text-sm text-muted-foreground">
                @{profile.user.username}
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 rounded-lg bg-muted/50 px-4 py-3 sm:gap-6">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Cards
                </p>
                <p className="text-lg font-extrabold">{stats.totalCards}</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Total Given
                </p>
                <p className="text-lg font-extrabold">
                  {formatAmount(stats.totalContributed)}
                </p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Creators
                </p>
                <p className="text-lg font-extrabold">
                  {stats.creatorsSupported}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* ====== VIDEO CARDS GRID (FlipCards) ====== */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Cards</h2>
            {videoCards.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Tap any card to flip
              </p>
            )}
          </div>

          {videoCards.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border py-12">
              <p className="text-sm text-muted-foreground">
                No cards yet. Contribute to a video to earn your first card!
              </p>
              <Link href="/">
                <Button className="font-bold hover:bg-liam-yellow-light">
                  Explore Videos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videoCards.map((card) => (
                <FlipCard
                  key={card.id}
                  tier={card.tier}
                  videoTitle={card.videoTitle}
                  creatorName={card.creatorName}
                  amountCents={card.amountCents}
                  cardId={card.id}
                  mintedAt={card.mintedAt}
                  message={card.message ?? undefined}
                  ownerName={profile.user.displayName}
                />
              ))}
            </div>
          )}
        </section>

        {/* ====== CREATOR AGGREGATE CARDS ====== */}
        {creatorCards.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-xl font-bold">Creator Cards</h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                  {new Date().getFullYear()} Aggregate
                </span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Your yearly relationship with each creator. These cards evolve
                as you contribute more &mdash; or get demoted if others
                contribute more.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {creatorCards.map((cc) => (
                  <div
                    key={cc.id}
                    className="flex flex-col overflow-hidden rounded-lg border-2 border-liam-black shadow-[4px_4px_0px_0px_rgba(8,7,8,0.15)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_6px_0px_0px_rgba(8,7,8,0.2)]"
                  >
                    {/* Tier header */}
                    <div
                      className="flex items-center justify-between px-4 py-3"
                      style={{
                        backgroundColor: `var(--color-tier-${cc.tier})`,
                      }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow-sm">
                        Creator Card &middot; {cc.year}
                      </span>
                      <CardBadge
                        tier={cc.tier as TierSlug}
                        className="bg-white/20 text-white"
                      />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-3 bg-card p-4">
                      <div>
                        <p className="text-sm font-bold">{cc.creatorName}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Your {cc.year} Passion
                        </p>
                      </div>

                      <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Total contributed
                          </p>
                          <p className="text-lg font-extrabold">
                            {formatAmount(cc.totalAmountCents)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Rarity
                          </p>
                          <p className="text-sm font-bold">
                            {TIER_LABELS[cc.tier]} Tier
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="h-1.5 bg-primary" />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ====== FRIENDS' TASTE / DISCOVERY ====== */}
        <Separator className="my-8" />
        <section>
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-xl font-bold">Friends&apos; Taste</h2>
            <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-bold text-secondary">
              Preview
            </span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Discover what your friends are watching and supporting. Cards are the
            new recommendations.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FAKE_FRIENDS_CARDS.map((fc, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Friend header */}
                <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-muted text-[10px] font-bold">
                      {fc.friendName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-bold">{fc.friendName}</span>
                  <span className="text-[10px] text-muted-foreground">
                    earned a card
                  </span>
                </div>

                {/* Card preview */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Mini tier dot */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `var(--color-tier-${fc.tier})`,
                    }}
                  >
                    <span className="text-xs font-bold text-white">
                      {formatAmount(fc.amountCents)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {fc.videoTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {fc.creatorName}
                    </p>
                  </div>
                  <CardBadge tier={fc.tier} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-6">
            <p className="text-sm font-bold">See more from your network</p>
            <p className="max-w-sm text-center text-xs text-muted-foreground">
              Follow friends to discover videos through their taste. Your cards
              tell the story of what you support.
            </p>
            <span className="mt-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              Coming Soon
            </span>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-border bg-muted/30 px-4 py-6 text-center">
        <p className="text-sm font-bold">LIAM</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Videos you can keep. No ads. Pay what you want. Earn a card.
        </p>
      </footer>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuth={setUser}
      />
    </div>
  );
}
