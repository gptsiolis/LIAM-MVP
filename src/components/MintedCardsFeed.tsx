"use client";

import { useState } from "react";
import Link from "next/link";
import { CardBadge, type TierSlug } from "@/components/CardBadge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

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

  const filtered =
    filter === "all"
      ? supporters
      : supporters.filter((s) => s.tier === filter);

  return (
    <section>
      <h3 className="mb-4 text-lg font-bold">Recent Supporters</h3>

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

      {filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          {supporters.length === 0
            ? "No contributions yet. Be the first!"
            : "No supporters with this tier yet."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s, i) => (
            <Link
              key={s.id}
              href={`/u/${s.username}`}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Avatar */}
              <Avatar className="h-10 w-10 transition-transform duration-200 group-hover:scale-105">
                {s.avatarUrl && <AvatarImage src={s.avatarUrl} alt={s.displayName} />}
                <AvatarFallback className="bg-muted text-sm font-bold">
                  {s.displayName[0]}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-bold group-hover:underline">
                    {s.displayName}
                  </span>
                  <CardBadge tier={s.tier} />
                </div>
                {s.message && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    &ldquo;{s.message}&rdquo;
                  </p>
                )}
              </div>

              {/* Amount + time */}
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold">{formatAmount(s.amountCents)}</p>
                <p className="text-xs text-muted-foreground">{s.timeAgo}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
