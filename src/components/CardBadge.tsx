import { cn } from "@/lib/utils";

export type TierSlug = "grey" | "brown" | "green" | "red" | "purple" | "gold";

interface CardBadgeProps {
  tier: TierSlug;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TIER_CONFIG: Record<
  TierSlug,
  { label: string; symbol: string; dotClass: string; bgClass: string; glowClass: string }
> = {
  grey:   { label: "Grey",   symbol: "◆", dotClass: "bg-tier-grey",   bgClass: "bg-tier-grey/15",   glowClass: "" },
  brown:  { label: "Brown",  symbol: "◆", dotClass: "bg-tier-brown",  bgClass: "bg-tier-brown/15",  glowClass: "" },
  green:  { label: "Green",  symbol: "★", dotClass: "bg-tier-green",  bgClass: "bg-tier-green/15",  glowClass: "" },
  red:    { label: "Red",    symbol: "★", dotClass: "bg-tier-red",    bgClass: "bg-tier-red/15",    glowClass: "shadow-[0_0_6px_rgba(220,38,38,0.3)]" },
  purple: { label: "Purple", symbol: "✦", dotClass: "bg-tier-purple", bgClass: "bg-tier-purple/15", glowClass: "shadow-[0_0_8px_rgba(147,51,234,0.4)]" },
  gold:   { label: "Gold",   symbol: "✦", dotClass: "bg-tier-gold",   bgClass: "bg-tier-gold/20",   glowClass: "shadow-[0_0_10px_rgba(234,179,8,0.5)]" },
};

const SIZE_CLASSES = {
  sm: "gap-1 rounded-md px-2 py-0.5 text-[10px]",
  md: "gap-1.5 rounded-lg px-2.5 py-1 text-xs",
  lg: "gap-2 rounded-lg px-3 py-1.5 text-sm",
};

export function CardBadge({ tier, size = "md", className }: CardBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <span
      className={cn(
        "inline-flex items-center font-bold",
        SIZE_CLASSES[size],
        config.bgClass,
        config.glowClass,
        className
      )}
    >
      <span className={cn("rounded-full", config.dotClass,
        size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2.5 w-2.5" : "h-3 w-3"
      )} />
      <span>{config.symbol}</span>
      {config.label}
    </span>
  );
}
