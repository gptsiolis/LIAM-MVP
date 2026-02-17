"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CardBadge, type TierSlug } from "@/components/CardBadge";

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
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

/** Tier sort priority — highest rarity first */
const TIER_PRIORITY: Record<TierSlug, number> = {
  gold: 6,
  purple: 5,
  red: 4,
  green: 3,
  brown: 2,
  grey: 1,
};

const FILTER_OPTIONS: { label: string; value: TierSlug | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Gold", value: "gold" },
  { label: "Purple", value: "purple" },
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Brown", value: "brown" },
  { label: "Grey", value: "grey" },
];

interface MintedCardsFeedProps {
  supporters: Supporter[];
}

export function MintedCardsFeed({ supporters }: MintedCardsFeedProps) {
  const [filter, setFilter] = useState<TierSlug | "all">("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    const list =
      filter === "all"
        ? [...supporters]
        : supporters.filter((s) => s.tier === filter);
    return list.sort(
      (a, b) => TIER_PRIORITY[b.tier] - TIER_PRIORITY[a.tier]
    );
  }, [supporters, filter]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section>
      {/* Header row — title + arrows */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Recent Supporters</h3>

        {sorted.length > 0 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-liam-neutral hover:text-foreground"
              aria-label="Scroll left"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-liam-neutral hover:text-foreground"
              aria-label="Scroll right"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Tier filter pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              filter === opt.value
                ? "bg-liam-black text-white"
                : "bg-muted text-muted-foreground hover:bg-liam-neutral"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          {supporters.length === 0
            ? "No contributions yet. Be the first!"
            : "No supporters with this tier yet."}
        </p>
      ) : (
        /* ===== HORIZONTAL SCROLLING CARD ROW ===== */
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin"
          style={{ scrollbarWidth: "thin" }}
        >
          {sorted.map((s) => (
            <Link
              key={s.id}
              href={`/u/${s.username}`}
              className="group flex shrink-0 snap-start flex-col"
            >
              {/* Trading card — portrait */}
              <div className="relative w-36 sm:w-44 aspect-[3/4] overflow-hidden rounded-lg border-[3px] shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl"
                style={{ borderColor: `var(--color-tier-${s.tier})` }}
              >
                {/* Inner frame */}
                <div className="absolute inset-[3px] flex flex-col overflow-hidden rounded-[5px] border border-border/40 bg-white">
                  {/* Tier header strip */}
                  <div
                    className="flex items-center justify-between px-2 py-1.5"
                    style={{ backgroundColor: `var(--color-tier-${s.tier})` }}
                  >
                    <CardBadge tier={s.tier} size="sm" className="bg-white/20 text-white" />
                  </div>

                  {/* Image area — fills most of the card */}
                  <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg
                      className="h-10 w-10 text-gray-300/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25z"
                      />
                    </svg>

                    {/* Amount badge — bottom-left overlay */}
                    <div className="absolute bottom-1.5 left-1.5">
                      <span className="rounded-md bg-liam-black/80 px-1.5 py-0.5 text-[11px] font-extrabold text-white backdrop-blur-sm">
                        {formatAmount(s.amountCents)}
                      </span>
                    </div>
                  </div>

                  {/* Yellow accent bar */}
                  <div className="h-1.5 bg-primary" />
                </div>
              </div>

              {/* Name + amount BELOW the card */}
              <div className="mt-2 flex w-36 sm:w-44 items-center gap-1.5 px-0.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
                  {s.displayName[0]}
                </span>
                <span className="truncate text-xs font-bold">
                  {s.displayName}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  &middot; {formatAmount(s.amountCents)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
