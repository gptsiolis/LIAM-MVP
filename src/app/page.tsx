"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PayBanner } from "@/components/PayBanner";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { MintSuccessModal } from "@/components/MintSuccessModal";
import { TopSupporters, type Supporter } from "@/components/TopSupporters";
import { CommentsSection } from "@/components/CommentsSection";
import { RecommendedSidebar } from "@/components/RecommendedSidebar";
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

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [rawSupporters, setRawSupporters] = useState<RawSupporter[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [viewCount, setViewCount] = useState(0);
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
      setViewCount(data.viewCount ?? 1234);
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

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left 2/3 — main content */}
          <div className="w-full min-w-0 lg:w-2/3">
            <section>
              <VideoPlayer
                title={video?.title ?? "Loading..."}
                embedUrl={video?.playbackUrl ?? ""}
              />

              {/* Title */}
              <h1 className="mt-4 text-xl font-extrabold leading-tight sm:text-2xl">
                {video?.title ?? "Loading..."}
              </h1>

              {/* Channel row — YouTube-style */}
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-liam-black text-sm font-extrabold text-white">
                    {video?.creatorName?.[0] ?? "?"}
                  </div>
                  <div>
                    <a
                      href={`/creator/${video?.creatorId ?? ""}`}
                      className="text-sm font-extrabold text-foreground hover:underline"
                    >
                      {video?.creatorName ?? "..."}
                    </a>
                    <p className="text-xs text-muted-foreground">Director</p>
                  </div>
                  <a
                    href={`/creator/${video?.creatorId ?? ""}`}
                    className="ml-1 rounded-none bg-liam-black px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-80"
                  >
                    Visit Channel
                  </a>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:bg-liam-black hover:text-white"
                    aria-label="Subscribe"
                    title="Subscribe"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Pay What You Want + Stats */}
              <div className="mt-4">
                <PayBanner
                  videoTitle={video?.title ?? ""}
                  creatorName={video?.creatorName ?? ""}
                  isLoggedIn={!!user}
                  isProcessing={contributing}
                  onContribute={handleContribute}
                  onAuthRequired={() => setAuthModalOpen(true)}
                  totalRaised={totalRaised}
                  supporterCount={supporters.length}
                  viewCount={viewCount}
                  endDate={endDate}
                />
              </div>
            </section>

            <Separator className="my-8" />

            <TopSupporters supporters={supporters} />

            <Separator className="my-8" />

            <CommentsSection />
          </div>

          {/* Right 1/3 — recommended videos */}
          <div className="w-full lg:w-1/3">
            <RecommendedSidebar />
          </div>
        </div>
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
