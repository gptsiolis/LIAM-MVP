"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PayBanner } from "@/components/PayBanner";
import { MintedCardsFeed, type Supporter } from "@/components/MintedCardsFeed";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { MintSuccessModal } from "@/components/MintSuccessModal";
import { Countdown } from "@/components/Countdown";
import { Leaderboard } from "@/components/Leaderboard";
import { contribute } from "@/app/actions/contribute";
import type { TierSlug } from "@/components/CardBadge";
import { Separator } from "@/components/ui/separator";
import { timeAgo } from "@/lib/utils";

interface VideoData {
  id: string;
  title: string;
  creatorName: string;
  creatorId: string;
  playbackUrl: string;
  contributableUntil: string;
}

interface RawSupporter {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  amountCents: number;
  tier: string;
  message?: string | null;
  createdAt: string;
}

function formatTotal(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [rawSupporters, setRawSupporters] = useState<RawSupporter[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [contributing, setContributing] = useState(false);
  const [mintResult, setMintResult] = useState<{
    amountCents: number;
    tierSlug: TierSlug;
    tierName: string;
  } | null>(null);

  // Fetch session on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {});
  }, []);

  // Fetch video + supporters
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/video");
      const data = await res.json();
      if (data.video) setVideo(data.video);
      setRawSupporters(data.supporters ?? []);
      setTotalRaised(data.totalRaised ?? 0);
    } catch {
      // Silently fail — will show empty state
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Map raw supporters to component format
  const supporters: Supporter[] = useMemo(
    () =>
      rawSupporters.map((s) => ({
        id: s.id,
        username: s.username,
        displayName: s.displayName,
        avatarUrl: s.avatarUrl ?? undefined,
        amountCents: s.amountCents,
        tier: s.tier as TierSlug,
        message: s.message ?? undefined,
        timeAgo: timeAgo(s.createdAt),
      })),
    [rawSupporters]
  );

  // Handle contribution via server action
  const handleContribute = useCallback(
    async (amountCents: number, message: string) => {
      if (!user || !video) return;
      setContributing(true);

      try {
        const result = await contribute({
          videoId: video.id,
          amountCents,
          message: message || undefined,
        });

        if (!result.success) {
          alert(result.error ?? "Contribution failed");
          return;
        }

        if (result.card) {
          setMintResult({
            amountCents: result.card.amountCents,
            tierSlug: result.card.tier as TierSlug,
            tierName: result.card.tierName,
          });
        }

        // Refresh data from DB (tiers may have changed for everyone)
        await fetchData();
      } catch {
        alert("Something went wrong. Please try again.");
      } finally {
        setContributing(false);
      }
    },
    [user, video, fetchData]
  );

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const endDate = video
    ? new Date(video.contributableUntil)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        user={user}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero: Video + Pay Banner */}
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-3/4">
            <VideoPlayer
              title={video?.title ?? "Loading..."}
              embedUrl={video?.playbackUrl ?? ""}
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-liam-black text-sm font-bold text-white">
                  {video?.creatorName?.[0] ?? "?"}
                </div>
                <div>
                  <p className="text-sm font-bold">{video?.creatorName ?? "..."}</p>
                  <p className="text-xs text-muted-foreground">
                    Director &middot; {supporters.length} supporter{supporters.length !== 1 && "s"}
                  </p>
                </div>
              </div>
              <button className="text-xs font-bold text-secondary transition-opacity hover:opacity-80">
                See all films by this creator &rarr;
              </button>
            </div>

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

          <div className="flex w-full flex-col gap-4 lg:w-1/4">
            <PayBanner
              videoTitle={video?.title ?? ""}
              creatorName={video?.creatorName ?? ""}
              isLoggedIn={!!user}
              isProcessing={contributing}
              onContribute={handleContribute}
              onAuthRequired={() => setAuthModalOpen(true)}
            />
            <Countdown endDate={endDate} />
          </div>
        </section>

        <Separator className="my-8" />

        {/* Card carousel — full width for horizontal scroll */}
        <MintedCardsFeed supporters={supporters} />

        <Separator className="my-8" />

        {/* Leaderboard below */}
        <Leaderboard supporters={supporters} />
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

      {mintResult && (
        <MintSuccessModal
          open={!!mintResult}
          onOpenChange={(open) => { if (!open) setMintResult(null); }}
          videoTitle={video?.title ?? ""}
          amountCents={mintResult.amountCents}
          tierSlug={mintResult.tierSlug}
          tierName={mintResult.tierName}
          displayName={user?.displayName ?? ""}
        />
      )}
    </div>
  );
}
