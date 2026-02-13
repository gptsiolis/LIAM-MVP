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

interface MintedCardsFeedProps {
  supporters: Supporter[];
}

export function MintedCardsFeed({ supporters }: MintedCardsFeedProps) {
  if (supporters.length === 0) {
    return (
      <section>
        <h3 className="mb-4 text-lg font-bold">Recent Supporters</h3>
        <p className="text-sm text-muted-foreground">
          No contributions yet. Be the first!
        </p>
      </section>
    );
  }

  return (
    <section>
      <h3 className="mb-4 text-lg font-bold">Recent Supporters</h3>
      <div className="flex flex-col gap-3">
        {supporters.map((s) => (
          <Link
            key={s.id}
            href={`/u/${s.username}`}
            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/30"
          >
            {/* Avatar */}
            <Avatar className="h-10 w-10">
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
    </section>
  );
}
