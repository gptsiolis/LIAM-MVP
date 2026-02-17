"use client";

import { useState } from "react";
import { CardBadge, type TierSlug } from "@/components/CardBadge";

interface FlipCardProps {
  /** Front face data */
  tier: TierSlug;
  videoTitle: string;
  creatorName: string;
  amountCents: number;
  /** Card identifier (last 4 chars shown) */
  cardId: string;

  /** Back face data */
  mintedAt: string;
  message?: string;
  /** Optional: display name of the owner */
  ownerName?: string;
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

export function FlipCard({
  tier,
  videoTitle,
  creatorName,
  amountCents,
  cardId,
  mintedAt,
  message,
  ownerName,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const serial = cardId.slice(-4).toUpperCase();

  return (
    <div
      className="group cursor-pointer"
      style={{ perspective: "800px" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ===== FRONT FACE ===== */}
        <div
          className="flex w-full flex-col overflow-hidden rounded-lg border-2 border-liam-black shadow-[4px_4px_0px_0px_rgba(8,7,8,0.15)] transition-shadow duration-200 group-hover:shadow-[4px_6px_0px_0px_rgba(8,7,8,0.2)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Tier header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: `var(--color-tier-${tier})` }}
          >
            <span className="text-xs font-bold text-white drop-shadow-sm">
              {TIER_LABELS[tier]} Card
            </span>
            <span className="text-xs font-bold text-white/80 drop-shadow-sm">
              #{serial}
            </span>
          </div>

          {/* Thumbnail placeholder */}
          <div className="flex h-24 items-center justify-center bg-muted/60">
            <svg
              className="h-8 w-8 text-muted-foreground/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25z"
              />
            </svg>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-2 bg-card px-4 py-3">
            <p className="text-sm font-bold leading-tight line-clamp-2">
              {videoTitle}
            </p>
            <p className="text-xs text-muted-foreground">by {creatorName}</p>
            <div className="mt-auto flex items-center justify-between pt-1">
              <CardBadge tier={tier} />
              <span className="text-lg font-extrabold">
                {formatAmount(amountCents)}
              </span>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-1.5 bg-primary" />
        </div>

        {/* ===== BACK FACE ===== */}
        <div
          className="absolute inset-0 flex w-full flex-col overflow-hidden rounded-lg border-2 border-liam-black bg-liam-black text-white shadow-[4px_4px_0px_0px_rgba(8,7,8,0.15)]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Back header */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-bold text-primary">LIAM</span>
            <span className="text-xs font-bold text-white/50">#{serial}</span>
          </div>

          {/* Back body */}
          <div className="flex flex-1 flex-col justify-center gap-4 px-4 py-3">
            {/* Card details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Contributed
                </span>
                <span className="text-sm font-bold text-primary">
                  {formatAmount(amountCents)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Minted
                </span>
                <span className="text-xs text-white/80">
                  {formatDate(mintedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Rarity
                </span>
                <CardBadge tier={tier} className="bg-white/10 text-white" />
              </div>
              {ownerName && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                    Owner
                  </span>
                  <span className="text-xs font-bold text-white/80">
                    {ownerName}
                  </span>
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className="rounded-md bg-white/5 px-3 py-2">
                <p className="text-xs italic text-white/70">
                  &ldquo;{message}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Back footer */}
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2">
            <span className="text-[10px] text-white/30">
              USDC on Base &middot; Verified
            </span>
            <span className="text-[10px] text-white/30">Tap to flip</span>
          </div>

          {/* Bottom accent */}
          <div className="h-1.5 bg-primary" />
        </div>
      </div>
    </div>
  );
}
