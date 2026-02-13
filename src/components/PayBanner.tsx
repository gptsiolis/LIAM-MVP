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

const QUICK_PICKS = [2, 5, 10, 25, 100];

interface PayBannerProps {
  videoTitle: string;
  creatorName: string;
}

export function PayBanner({ videoTitle, creatorName }: PayBannerProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleQuickPick = (value: number) => {
    setAmount(value.toString());
  };

  const handleContribute = () => {
    // Will wire to server action in Step 5
    alert(`Contributing $${amount} to "${videoTitle}" by ${creatorName}`);
  };

  const isValid = Number(amount) >= 1 && Number(amount) <= 10000;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Pay What You Want</CardTitle>
        <CardDescription>
          No ads. Pay what you want. Earn a card.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Quick-pick buttons */}
        <div className="flex flex-wrap gap-2">
          {QUICK_PICKS.map((pick) => (
            <Button
              key={pick}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPick(pick)}
              className={
                amount === pick.toString()
                  ? "border-primary bg-primary/10 font-bold"
                  : ""
              }
            >
              ${pick}
            </Button>
          ))}
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
          disabled={!isValid}
          onClick={handleContribute}
          className="w-full text-sm font-bold hover:bg-liam-yellow-light"
        >
          {isValid ? `Contribute $${amount}` : "Contribute"}
        </Button>

        {/* Explainer */}
        <p className="text-center text-xs text-muted-foreground">
          Simulated USDC payment &middot; You&apos;ll earn a collectible card
        </p>
      </CardContent>
    </Card>
  );
}
