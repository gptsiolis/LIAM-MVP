import { CardBadge, type TierSlug } from "@/components/CardBadge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface LeaderboardEntry {
  username: string;
  displayName: string;
  avatarUrl?: string;
  amountCents: number;
  tier: TierSlug;
}

interface LeaderboardProps {
  supporters: LeaderboardEntry[];
}

function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

const RANK_STYLES: Record<number, string> = {
  0: "bg-tier-gold/20 text-tier-gold",
  1: "bg-liam-neutral text-muted-foreground",
  2: "bg-tier-brown/20 text-tier-brown",
};

export function Leaderboard({ supporters }: LeaderboardProps) {
  // Sort by amount desc, take top 5
  const sorted = [...supporters]
    .sort((a, b) => b.amountCents - a.amountCents)
    .slice(0, 5);

  if (sorted.length === 0) return null;

  return (
    <section>
      <h3 className="mb-4 text-lg font-bold">Top Supporters</h3>
      <div className="flex flex-col gap-2">
        {sorted.map((s, i) => (
          <div
            key={s.username}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-sm"
          >
            {/* Rank */}
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                RANK_STYLES[i] ?? "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>

            {/* Avatar */}
            <Avatar className="h-8 w-8">
              {s.avatarUrl && <AvatarImage src={s.avatarUrl} alt={s.displayName} />}
              <AvatarFallback className="bg-muted text-xs font-bold">
                {s.displayName[0]}
              </AvatarFallback>
            </Avatar>

            {/* Name + tier */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-bold">{s.displayName}</span>
                <CardBadge tier={s.tier} />
              </div>
            </div>

            {/* Amount */}
            <span className="shrink-0 text-sm font-extrabold">
              {formatAmount(s.amountCents)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
