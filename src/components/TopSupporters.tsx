"use client";

import Link from "next/link";
import { CardBadge, type TierSlug } from "@/components/CardBadge";
import { TIER_HEX, TIER_POSTER } from "@/components/FlipCard";

export interface Supporter {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  amountCents: number;
  tier: TierSlug;
  message?: string;
  timeAgo: string;
}

function formatAmount(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function tierThumb(tier: TierSlug): string {
  return TIER_POSTER[tier];
}

/* ------------------------------------------------------------------ */
/*  Mini trading card — shared across all three rows                  */
/* ------------------------------------------------------------------ */
function SupporterCard({
  supporter: s,
  rank,
  size,
}: {
  supporter: Supporter;
  rank: number;
  size: "lg" | "md" | "sm";
}) {
  const tierColor = TIER_HEX[s.tier];

  const widthClass =
    size === "lg"
      ? "w-48 sm:w-56"
      : size === "md"
        ? "w-32 sm:w-40"
        : "min-w-0 flex-1";

  const borderWidth = size === "lg" ? "4px" : size === "md" ? "3px" : "2px";

  return (
    <Link
      href={`/u/${s.username}`}
      className={`group flex flex-col items-center ${size === "sm" ? "min-w-0 flex-1" : "shrink-0"}`}
    >
      {/* Rank badge */}
      <span
        className={`mb-1.5 flex items-center justify-center rounded-full font-extrabold ${
          rank === 1
            ? "h-8 w-8 bg-tier-gold/20 text-sm text-tier-gold"
            : rank <= 3
              ? "h-7 w-7 bg-muted text-xs text-muted-foreground"
              : "h-5 w-5 text-[10px] text-muted-foreground"
        }`}
      >
        {rank}
      </span>

      {/* Card */}
      <div
        className={`${size === "sm" ? "w-full" : widthClass} relative aspect-[3/4] overflow-hidden rounded-lg shadow-md transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl`}
        style={{ border: `${borderWidth} solid ${tierColor}` }}
      >
        {/* Inner frame */}
        <div className="absolute inset-[3px] flex flex-col overflow-hidden rounded-[5px] border border-border/40 bg-white">
          {/* Tier header strip */}
          <div
            className="flex items-center justify-between px-1.5 py-1"
            style={{ backgroundColor: tierColor }}
          >
            <CardBadge
              tier={s.tier}
              size="sm"
              className="bg-white/20 text-white"
            />
            {size !== "sm" && (
              <span className="text-[9px] font-bold text-white/70">
                #{s.id.slice(-4).toUpperCase()}
              </span>
            )}
          </div>

          {/* Image area */}
          <div className="relative flex-1 overflow-hidden bg-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tierThumb(s.tier)}
              alt="Video thumbnail"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Amount badge */}
            <div className="absolute bottom-1 left-1">
              <span
                className={`rounded-md bg-liam-black/80 px-1 py-0.5 font-extrabold text-white backdrop-blur-sm ${
                  size === "sm" ? "text-[9px]" : "text-[11px]"
                }`}
              >
                {formatAmount(s.amountCents)}
              </span>
            </div>
          </div>

          {/* Yellow accent bar */}
          <div className={size === "sm" ? "h-1" : "h-1.5"} style={{ backgroundColor: "#ffc600" }} />
        </div>
      </div>

      {/* Name below card */}
      <div className="mt-1.5 flex w-full items-center justify-center gap-1 px-0.5">
        <span
          className={`flex shrink-0 items-center justify-center rounded-full bg-muted font-bold ${
            size === "sm"
              ? "h-4 w-4 text-[7px]"
              : "h-5 w-5 text-[9px]"
          }`}
        >
          {s.displayName[0]}
        </span>
        <span
          className={`truncate font-bold ${
            size === "sm" ? "text-[10px]" : "text-xs"
          }`}
        >
          {s.displayName}
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export function TopSupporters({ supporters }: { supporters: Supporter[] }) {
  const sorted = [...supporters].sort(
    (a, b) => b.amountCents - a.amountCents
  );

  if (sorted.length === 0) return null;

  const top3 = sorted.slice(0, 3);
  const next5 = sorted.slice(3, 8);
  const next10 = sorted.slice(8, 18);

  return (
    <section>
      <h3 className="mb-6 text-lg font-extrabold">Top Supporters</h3>

      {/* Row 1: Top 3 — large, #1 is the biggest */}
      <div className="flex items-end justify-center gap-4 sm:gap-6">
        {/* #2 on the left */}
        {top3[1] && (
          <SupporterCard supporter={top3[1]} rank={2} size="lg" />
        )}
        {/* #1 in the center, raised higher */}
        {top3[0] && (
          <div className="-mb-2 scale-110 sm:scale-[1.15]">
            <SupporterCard supporter={top3[0]} rank={1} size="lg" />
          </div>
        )}
        {/* #3 on the right */}
        {top3[2] && (
          <SupporterCard supporter={top3[2]} rank={3} size="lg" />
        )}
      </div>

      {/* Row 2: #4–8 — medium */}
      {next5.length > 0 && (
        <div className="mt-8 flex flex-wrap items-start justify-center gap-3 sm:gap-4">
          {next5.map((s, i) => (
            <SupporterCard
              key={s.id}
              supporter={s}
              rank={i + 4}
              size="md"
            />
          ))}
        </div>
      )}

      {/* Row 3: #9–18 — small */}
      {next10.length > 0 && (
        <div className="mt-6 flex items-start justify-center gap-2 sm:gap-3">
          {next10.map((s, i) => (
            <SupporterCard
              key={s.id}
              supporter={s}
              rank={i + 9}
              size="sm"
            />
          ))}
        </div>
      )}

      {/* View all link */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/cards"
          className="text-sm font-bold text-liam-blue hover:underline"
        >
          View all cards →
        </Link>
      </div>
    </section>
  );
}
