"use client";

import { useState } from "react";
import { CardBadge, type TierSlug } from "@/components/CardBadge";

/** LOTR poster variations per tier — TMDB */
const TIER_POSTER: Record<TierSlug, string> = {
  gold:   "https://image.tmdb.org/t/p/w780/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
  purple: "https://image.tmdb.org/t/p/w780/5m0zjctrxy9HeSAtnGWNLlsnr8z.jpg",
  red:    "https://image.tmdb.org/t/p/w780/w3NF110cyjqxkQD2azmUMyaFzhG.jpg",
  green:  "https://image.tmdb.org/t/p/w780/b4XZizlvqQkZno8cT3VPBYTGudB.jpg",
  brown:  "https://image.tmdb.org/t/p/w780/cSkGnAA9b7Hj4rs51KdMsUfFpBd.jpg",
  grey:   "https://image.tmdb.org/t/p/w780/wVm5xYVklWbWMKMbke06Y6kpE9R.jpg",
};

const DEFAULT_THUMB = TIER_POSTER.gold;

interface FlipCardProps {
  tier: TierSlug;
  videoTitle: string;
  creatorName: string;
  amountCents: number;
  cardId: string;
  mintedAt: string;
  message?: string;
  ownerName?: string;
  thumbnailUrl?: string;
}

function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const TIER_LABELS: Record<TierSlug, string> = {
  grey: "Grey",
  brown: "Brown",
  green: "Green",
  red: "Red",
  purple: "Purple",
  gold: "Gold",
};

/** Exact tier hex values — used in inline styles to bypass Tailwind border-border override */
const TIER_HEX: Record<TierSlug, string> = {
  grey: "#9ca3af",
  brown: "#92643a",
  green: "#16a34a",
  red: "#dc2626",
  purple: "#9333ea",
  gold: "#eab308",
};

/** Tier-specific outer glow on hover */
const TIER_HOVER_GLOW: Record<TierSlug, string> = {
  grey: "group-hover:shadow-[0_8px_30px_rgba(156,163,175,0.35)]",
  brown: "group-hover:shadow-[0_8px_30px_rgba(146,100,58,0.35)]",
  green: "group-hover:shadow-[0_8px_30px_rgba(22,163,74,0.4)]",
  red: "group-hover:shadow-[0_8px_30px_rgba(220,38,38,0.4)]",
  purple: "group-hover:shadow-[0_8px_30px_rgba(147,51,234,0.45)]",
  gold: "group-hover:shadow-[0_8px_30px_rgba(234,179,8,0.5)]",
};

export { TIER_HEX, TIER_POSTER };

export function FlipCard({
  tier,
  videoTitle,
  creatorName,
  amountCents,
  cardId,
  mintedAt,
  message,
  ownerName,
  thumbnailUrl,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const serial = cardId.slice(-4).toUpperCase();
  const tierColor = TIER_HEX[tier];
  const thumb = thumbnailUrl || TIER_POSTER[tier] || DEFAULT_THUMB;

  return (
    <div
      className="group cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped((f) => !f)}
    >
      {/* Card container — portrait 2:3 ratio */}
      <div
        className="relative aspect-[2/3] w-full transition-transform duration-500 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ===== FRONT FACE ===== */}
        <div
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-shadow duration-300 ${TIER_HOVER_GLOW[tier]}`}
          style={{
            backfaceVisibility: "hidden",
            border: `4px solid ${tierColor}`,
          }}
        >
          {/* --- Inner frame border --- */}
          <div className="flex flex-1 flex-col m-1.5 rounded-xl overflow-hidden border border-border/60">
            {/* Tier header strip */}
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ backgroundColor: tierColor }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-white drop-shadow-sm">
                {TIER_LABELS[tier]} Card
              </span>
              <span className="text-[10px] font-bold text-white/70">
                #{serial}
              </span>
            </div>

            {/* Image area — fills most of card height */}
            <div className="relative flex-1 overflow-hidden bg-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb}
                alt={videoTitle}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Bottom gradient for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Rarity badge — top-right corner overlay */}
              <div className="absolute right-2 top-2">
                <CardBadge tier={tier} size="lg" className="bg-white/90 backdrop-blur-sm" />
              </div>

              {/* Amount badge — bottom-left */}
              <div className="absolute bottom-2 left-2">
                <span className="rounded-lg bg-liam-black/80 px-2.5 py-1 text-sm font-extrabold text-white backdrop-blur-sm">
                  {formatAmount(amountCents)}
                </span>
              </div>
            </div>

            {/* Text area — bottom portion */}
            <div className="flex flex-col gap-1 bg-white px-3 py-3">
              <p className="text-sm font-bold leading-snug text-liam-black line-clamp-2">
                {videoTitle}
              </p>
              <p className="text-xs text-gray-500">by {creatorName}</p>
            </div>

            {/* Yellow accent bar */}
            <div className="h-2 bg-primary" />
          </div>
        </div>

        {/* ===== BACK FACE ===== */}
        <div
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-liam-black shadow-xl ${TIER_HOVER_GLOW[tier]}`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            border: `4px solid ${tierColor}`,
          }}
        >
          {/* Inner frame */}
          <div className="flex flex-1 flex-col m-1.5 rounded-xl overflow-hidden border border-white/10">
            {/* Back header */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-sm font-extrabold tracking-wide text-primary">
                LIAM
              </span>
              <span className="text-[10px] font-bold text-white/40">
                #{serial}
              </span>
            </div>

            {/* Stats area */}
            <div className="flex flex-1 flex-col justify-center gap-3 px-4">
              {/* Video title on back */}
              <p className="mb-1 text-xs font-bold leading-snug text-white/90 line-clamp-2">
                {videoTitle}
              </p>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Contributed
                  </span>
                  <span className="text-sm font-extrabold text-primary">
                    {formatAmount(amountCents)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Minted
                  </span>
                  <span className="text-xs font-bold text-white/80">
                    {formatDate(mintedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Rarity
                  </span>
                  <CardBadge
                    tier={tier}
                    size="sm"
                    className="bg-white/10 text-white"
                  />
                </div>
                {ownerName && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Owner
                    </span>
                    <span className="text-xs font-bold text-white/80">
                      {ownerName}
                    </span>
                  </div>
                )}
              </div>

              {/* Message quote */}
              {message && (
                <div className="mt-1 rounded-lg bg-white/5 px-3 py-2">
                  <p className="text-[11px] italic leading-relaxed text-white/60">
                    &ldquo;{message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Back footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-3 py-2">
              <span className="text-[9px] font-medium text-white/25">
                USDC on Base &middot; Verified
              </span>
              <span className="text-[9px] font-medium text-white/25">
                Tap to flip
              </span>
            </div>

            {/* Yellow accent bar */}
            <div className="h-2 bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
