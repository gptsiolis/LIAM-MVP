"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCardIcon, WalletIcon, Loader2Icon, ClockIcon } from "lucide-react";

const QUICK_PICKS = [2, 5, 10, 25, 100, 250];

type PaymentMethod = "card" | "usdc";

interface PayBannerProps {
  videoTitle: string;
  creatorName: string;
  isLoggedIn: boolean;
  isProcessing: boolean;
  onContribute: (amountCents: number, message: string) => void;
  onAuthRequired: () => void;
  totalRaised: number;
  supporterCount: number;
  viewCount: number;
  endDate: Date;
}

function formatTotal(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function useCountdownText(endDate: Date): { text: string; expired: boolean } {
  const [result, setResult] = useState({ text: "", expired: false });

  useEffect(() => {
    function calc() {
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) return { text: "Closed", expired: true };
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      if (d > 0) return { text: `${d}d ${h}h left`, expired: false };
      if (h > 0) return { text: `${h}h ${m}m left`, expired: false };
      return { text: `${m}m left`, expired: false };
    }
    setResult(calc());
    const id = setInterval(() => setResult(calc()), 60_000);
    return () => clearInterval(id);
  }, [endDate]);

  return result;
}

export function PayBanner({
  creatorName,
  isLoggedIn,
  isProcessing,
  onContribute,
  onAuthRequired,
  totalRaised,
  supporterCount,
  viewCount,
  endDate,
}: PayBannerProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("card");
  const countdown = useCountdownText(endDate);

  const handleQuickPick = (value: number) => setAmount(value.toString());

  const handleContribute = () => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    const cents = Math.round(Number(amount) * 100);
    if (cents < 100 || cents > 1_000_000) return;
    onContribute(cents, message);
    setAmount("");
    setMessage("");
  };

  const numAmount = Number(amount);
  const isValid = numAmount >= 1 && numAmount <= 10_000;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Brand accent — yellow top edge */}
      <div className="h-1 bg-primary" />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {/* Stats + title */}
        <div className="mb-4">
          <p className="text-lg font-extrabold">{formatTotal(totalRaised)} raised</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[13px] text-muted-foreground">
            <span>
              <span className="font-bold text-foreground">{supporterCount}</span>{" "}
              supporter{supporterCount !== 1 && "s"}
            </span>
            <span className="text-border">&middot;</span>
            <span>
              <span className="font-bold text-foreground">{viewCount.toLocaleString()}</span>{" "}
              view{viewCount !== 1 && "s"}
            </span>
            <span className="text-border">&middot;</span>
            <span
              className={`inline-flex items-center gap-1 ${countdown.expired ? "font-bold text-liam-red" : ""}`}
            >
              <ClockIcon className="h-3 w-3" />
              {countdown.text}
            </span>
          </div>
        </div>

        {/* Row 2: Custom amount + quick picks + payment toggle */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Custom amount */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              min={1}
              max={10000}
              step={1}
              placeholder="Custom"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-9 w-28 pl-7 font-bold"
            />
          </div>

          {QUICK_PICKS.map((pick) => {
            const selected = amount === pick.toString();
            return (
              <button
                key={pick}
                onClick={() => handleQuickPick(pick)}
                className={`h-9 rounded-lg px-4 text-sm font-bold transition-all duration-150 ${
                  selected
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "bg-muted text-foreground hover:bg-liam-yellow-light/40"
                }`}
              >
                ${pick}
              </button>
            );
          })}

          {/* Push payment toggle right on large screens */}
          <div className="hidden flex-1 lg:block" />

          {/* Payment method toggle */}
          <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
            <button
              onClick={() => setPayMethod("card")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors ${
                payMethod === "card"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCardIcon className="h-3.5 w-3.5" />
              Card
            </button>
            <button
              onClick={() => setPayMethod("usdc")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors ${
                payMethod === "usdc"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <WalletIcon className="h-3.5 w-3.5" />
              USDC
            </button>
          </div>
        </div>

        {/* Row 3: Message + CTA */}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="text"
            placeholder="Add a comment (optional)"
            maxLength={140}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-10 flex-1"
          />

          <Button
            size="lg"
            disabled={!isValid || isProcessing}
            onClick={handleContribute}
            className="h-10 gap-2 whitespace-nowrap px-8 text-sm font-bold hover:bg-liam-yellow-light"
          >
            {isProcessing ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : isValid ? (
              `Contribute $${amount}`
            ) : (
              "Contribute"
            )}
          </Button>
        </div>

        {/* Micro-copy */}
        <p className="mt-3 text-center text-xs text-muted-foreground sm:text-left">
          No ads &middot; Support {creatorName || "this creator"} &middot; Earn
          a collectible card &middot;{" "}
          {payMethod === "card"
            ? "Simulated checkout"
            : "Simulated USDC on Base"}{" "}
          &middot; No real charge
        </p>
      </div>
    </div>
  );
}
