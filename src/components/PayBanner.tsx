"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCardIcon, WalletIcon, Loader2Icon } from "lucide-react";

const QUICK_PICKS = [2, 5, 10, 25, 100];

type PaymentMethod = "card" | "usdc";

interface PayBannerProps {
  videoTitle: string;
  creatorName: string;
  isLoggedIn: boolean;
  isProcessing: boolean;
  onContribute: (amountCents: number, message: string) => void;
  onAuthRequired: () => void;
}

export function PayBanner({
  videoTitle,
  creatorName,
  isLoggedIn,
  isProcessing,
  onContribute,
  onAuthRequired,
}: PayBannerProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("card");

  const handleQuickPick = (value: number) => {
    setAmount(value.toString());
  };

  const handleContribute = () => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    const cents = Math.round(Number(amount) * 100);
    if (cents < 100 || cents > 1000000) return;

    onContribute(cents, message);
    setAmount("");
    setMessage("");
  };

  const numAmount = Number(amount);
  const isValid = numAmount >= 1 && numAmount <= 10000;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Pay What You Want</CardTitle>
        <CardDescription>
          No ads. Support {creatorName || "this creator"}. Earn a card.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Payment method toggle */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setPayMethod("card")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold transition-colors ${
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
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold transition-colors ${
              payMethod === "usdc"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <WalletIcon className="h-3.5 w-3.5" />
            USDC
          </button>
        </div>

        {/* Quick-pick buttons — 3+2 grid */}
        <div className="grid grid-cols-3 gap-2">
          {QUICK_PICKS.map((pick) => {
            const selected = amount === pick.toString();
            return (
              <button
                key={pick}
                onClick={() => handleQuickPick(pick)}
                className={`flex h-10 items-center justify-center rounded-lg text-sm font-bold transition-all duration-150 ${
                  selected
                    ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30"
                    : "bg-muted text-foreground hover:bg-liam-yellow-light/40"
                }`}
              >
                ${pick}
              </button>
            );
          })}
        </div>

        {/* Custom amount input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
            $
          </span>
          <Input
            type="number"
            min={1}
            max={10000}
            step={1}
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-7 font-bold"
          />
        </div>

        {/* Optional message */}
        <Input
          type="text"
          placeholder="Add a message (optional)"
          maxLength={140}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* CTA */}
        <Button
          size="lg"
          disabled={!isValid || isProcessing}
          onClick={handleContribute}
          className="w-full gap-2 text-sm font-bold hover:bg-liam-yellow-light"
        >
          {isProcessing ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Minting your card...
            </>
          ) : isValid ? (
            `Contribute $${amount}`
          ) : (
            "Contribute"
          )}
        </Button>

        {/* Explainer */}
        <p className="text-center text-xs text-muted-foreground">
          {payMethod === "card" ? (
            <>Simulated Stripe checkout &middot; No real charge</>
          ) : (
            <>Simulated USDC on Base &middot; No real transaction</>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
