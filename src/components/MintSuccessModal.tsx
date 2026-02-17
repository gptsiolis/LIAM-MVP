"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardBadge, type TierSlug } from "@/components/CardBadge";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Card Minted!
          </DialogTitle>
        </DialogHeader>

        {/* Card visual */}
        <div className="mx-auto flex w-full max-w-[280px] flex-col overflow-hidden rounded-lg border-2 border-liam-black shadow-[4px_4px_0px_0px_rgba(8,7,8,0.15)] transition-transform duration-300 hover:scale-[1.02]">
          {/* Card top — tier-colored header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: `var(--color-tier-${tierSlug})` }}
          >
            <span className="text-xs font-bold text-white drop-shadow-sm">
              {tierName} Card
            </span>
            <span className="text-xs font-bold text-white/80 drop-shadow-sm">
              #{Math.floor(Math.random() * 900 + 100)}
            </span>
          </div>

          {/* Card body */}
          <div className="flex flex-col gap-3 bg-card p-4">
            <p className="text-sm font-bold leading-tight">{videoTitle}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{displayName}</span>
              <span className="text-lg font-extrabold">{formatAmount(amountCents)}</span>
            </div>
            <div className="flex items-center justify-between">
              <CardBadge tier={tierSlug} />
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Card bottom accent — layered style guide look */}
          <div className="h-1.5 bg-primary" />
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
