import Link from "next/link";
import { CardBadge, type TierSlug } from "@/components/CardBadge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface Supporter {
  username: string;
  displayName: string;
  avatarUrl?: string;
  amountCents: number;
  tier: TierSlug;
  message?: string;
  timeAgo: string;
}

// Fake data — will be replaced with DB queries in Step 5
const FAKE_SUPPORTERS: Supporter[] = [
  {
    username: "alexm",
    displayName: "Alex M.",
    amountCents: 10000,
    tier: "red",
    message: "This film changed my perspective",
    timeAgo: "2m ago",
  },
  {
    username: "jordank",
    displayName: "Jordan K.",
    amountCents: 2500,
    tier: "green",
    message: "Love the cinematography",
    timeAgo: "8m ago",
  },
  {
    username: "samw",
    displayName: "Sam W.",
    amountCents: 500,
    tier: "brown",
    timeAgo: "15m ago",
  },
  {
    username: "rileyj",
    displayName: "Riley J.",
    amountCents: 25000,
    tier: "purple",
    message: "Instant classic. Supporting the movement.",
    timeAgo: "1h ago",
  },
  {
    username: "taylorc",
    displayName: "Taylor C.",
    amountCents: 200,
    tier: "grey",
    timeAgo: "2h ago",
  },
];

function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function MintedCardsFeed() {
  return (
    <section>
      <h3 className="mb-4 text-lg font-bold">Recent Supporters</h3>
      <div className="flex flex-col gap-3">
        {FAKE_SUPPORTERS.map((s) => (
          <Link
            key={s.username}
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
