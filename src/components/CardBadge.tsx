import { cn } from "@/lib/utils";

export type TierSlug = "grey" | "brown" | "green" | "red" | "purple" | "gold";

interface CardBadgeProps {
  tier: TierSlug;
  className?: string;
}

const TIER_CONFIG: Record<TierSlug, { label: string; dotClass: string; bgClass: string }> = {
  grey:   { label: "Grey",   dotClass: "bg-tier-grey",   bgClass: "bg-tier-grey/10" },
  brown:  { label: "Brown",  dotClass: "bg-tier-brown",  bgClass: "bg-tier-brown/10" },
  green:  { label: "Green",  dotClass: "bg-tier-green",  bgClass: "bg-tier-green/10" },
  red:    { label: "Red",    dotClass: "bg-tier-red",    bgClass: "bg-tier-red/10" },
  purple: { label: "Purple", dotClass: "bg-tier-purple", bgClass: "bg-tier-purple/10" },
  gold:   { label: "Gold",   dotClass: "bg-tier-gold",   bgClass: "bg-tier-gold/10" },
};

export function CardBadge({ tier, className }: CardBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold",
        config.bgClass,
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}
