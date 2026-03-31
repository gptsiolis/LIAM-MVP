"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardBadge, type TierSlug } from "@/components/CardBadge";
import { TIER_HEX, TIER_POSTER } from "@/components/FlipCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MintSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoTitle: string;
  amountCents: number;
  tierSlug: TierSlug;
  tierName: string;
  displayName: string;
}

function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function MintSuccessModal({
  open,
  onOpenChange,
  videoTitle,
  amountCents,
  tierSlug,
  tierName,
  displayName,
}: MintSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just earned a ${tierName} Card on LIAM for supporting "${videoTitle}" with ${formatAmount(amountCents)}! No ads. Pay what you want. Earn a card.`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const serial = Math.floor(Math.random() * 900 + 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Card Minted!
          </DialogTitle>
        </DialogHeader>

        {/* Trading card visual — portrait ratio */}
        <div className="mx-auto w-full max-w-[240px] aspect-[2/3] transition-transform duration-300 hover:scale-[1.02]">
          <div
            className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            style={{ border: `4px solid ${TIER_HEX[tierSlug]}` }}
          >
            {/* Inner frame */}
            <div className="flex flex-1 flex-col m-1.5 rounded-xl overflow-hidden border border-border/60">
              {/* Tier header */}
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{ backgroundColor: TIER_HEX[tierSlug] }}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-white drop-shadow-sm">
                  {tierName} Card
                </span>
                <span className="text-[10px] font-bold text-white/70">
                  #{serial}
                </span>
              </div>

              {/* Image area */}
              <div className="relative flex-1 overflow-hidden bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={TIER_POSTER[tierSlug]}
                  alt={videoTitle}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Rarity badge overlay */}
                <div className="absolute right-2 top-2">
                  <CardBadge tier={tierSlug} size="md" className="bg-white/90 backdrop-blur-sm" />
                </div>

                {/* Amount overlay */}
                <div className="absolute bottom-2 left-2">
                  <span className="rounded-lg bg-liam-black/80 px-2 py-0.5 text-xs font-extrabold text-white backdrop-blur-sm">
                    {formatAmount(amountCents)}
                  </span>
                </div>
              </div>

              {/* Text area */}
              <div className="flex flex-col gap-0.5 bg-white px-3 py-2">
                <p className="text-xs font-bold leading-snug text-liam-black line-clamp-2">
                  {videoTitle}
                </p>
                <p className="text-[10px] text-gray-500">{displayName}</p>
              </div>

              {/* Yellow accent */}
              <div className="h-1.5 bg-primary" />
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          You earned a <span className="font-bold">{tierName}</span> card for
          contributing {formatAmount(amountCents)}!
        </p>

        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full font-bold hover:bg-liam-yellow-light"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full font-bold"
            onClick={handleShare}
          >
            {copied ? "Copied!" : `Share your ${tierName} Card`}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          <a
            href="/profile"
            className="font-bold text-secondary hover:underline"
          >
            View all your cards in Collection &rarr;
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
