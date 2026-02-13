import type { TierSlug } from "@/components/CardBadge";

export interface TierInfo {
  slug: TierSlug;
  name: string;
  color: string; // hex
}

/**
 * Given a percentile (0..1, where 1 = top contributor),
 * return the rarity tier.
 *
 * Thresholds (from spec):
 *  < 0.50        → Grey
 *  [0.50, 0.75)  → Brown
 *  [0.75, 0.90)  → Green
 *  [0.90, 0.99)  → Red
 *  [0.99, 0.999) → Purple
 *  >= 0.999      → Gold
 */
export function getTierFromPercentile(percentile: number): TierInfo {
  if (percentile >= 0.999) return { slug: "gold", name: "Gold", color: "#eab308" };
  if (percentile >= 0.99) return { slug: "purple", name: "Purple", color: "#9333ea" };
  if (percentile >= 0.90) return { slug: "red", name: "Red", color: "#dc2626" };
  if (percentile >= 0.75) return { slug: "green", name: "Green", color: "#16a34a" };
  if (percentile >= 0.50) return { slug: "brown", name: "Brown", color: "#92643a" };
  return { slug: "grey", name: "Grey", color: "#9ca3af" };
}

/**
 * Compute the percentile for each contribution amount in the list.
 * Higher amount = higher percentile.
 *
 * - Sort by amount descending, then by index ascending (earlier = higher rank on tie).
 * - Percentile = position / total (1-indexed from bottom).
 * - Single contribution = 1.0 (Gold).
 *
 * Returns an array of percentiles in the SAME order as the input amounts.
 */
export function computePercentiles(amountsCents: number[]): number[] {
  const n = amountsCents.length;
  if (n === 0) return [];
  if (n === 1) return [1.0];

  // Create indexed entries, sort by amount desc then original index asc (stable tie-break)
  const indexed = amountsCents.map((amount, i) => ({ amount, originalIndex: i }));
  indexed.sort((a, b) => {
    if (b.amount !== a.amount) return b.amount - a.amount;
    return a.originalIndex - b.originalIndex; // earlier contribution ranks higher on tie
  });

  // Assign percentiles: rank 0 (top) → percentile = (n - 0) / n = 1.0 down to rank n-1 → 1/n
  const percentiles = new Array<number>(n);
  for (let rank = 0; rank < n; rank++) {
    percentiles[indexed[rank].originalIndex] = (n - rank) / n;
  }

  return percentiles;
}

/**
 * Convenience: compute tiers for all contributions at once.
 * Returns array of TierInfo in same order as input amounts.
 */
export function computeTiers(amountsCents: number[]): TierInfo[] {
  return computePercentiles(amountsCents).map(getTierFromPercentile);
}
