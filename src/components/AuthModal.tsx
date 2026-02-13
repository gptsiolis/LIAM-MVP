"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface FakeUser {
  displayName: string;
  email: string;
  username: string;
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuth: (user: FakeUser) => void;
}

export function AuthModal({ open, onOpenChange, onAuth }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit =
    email.includes("@") && password.length >= 4 && (mode === "login" || displayName.length >= 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Fake auth — just pass the info up
    const username = displayName.toLowerCase().replace(/\s+/g, "") || email.split("@")[0];
    onAuth({ displayName: displayName || email.split("@")[0], email, username });
    onOpenChange(false);

    // Reset
    setEmail("");
    setDisplayName("");
    setPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signup"
              ? "Sign up to contribute and earn collectible cards."
              : "Log in to continue your contribution."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm font-bold">Display Name</label>
              <Input
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-bold">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus={mode === "login"}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" size="lg" disabled={!canSubmit} className="w-full font-bold">
            {mode === "signup" ? "Sign Up" : "Log In"}
          </Button>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full font-bold"
            onClick={() => {
              onAuth({
                displayName: "Wallet User",
                email: "wallet@demo.liam",
                username: "walletuser",
              });
              onOpenChange(false);
            }}
          >
            Connect Wallet
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-bold text-secondary hover:underline"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-bold text-secondary hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
