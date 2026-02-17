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
import { WalletIcon, MailIcon, Loader2Icon } from "lucide-react";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  username: string;
  avatarUrl?: string | null;
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuth: (user: AuthUser) => void;
}

type ModalView = "main" | "email-signup" | "email-login" | "wallet-creating";

export function AuthModal({ open, onOpenChange, onAuth }: AuthModalProps) {
  const [view, setView] = useState<ModalView>("main");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletStep, setWalletStep] = useState(0);

  const resetForm = () => {
    setEmail("");
    setDisplayName("");
    setUsername("");
    setPassword("");
    setError("");
    setView("main");
    setWalletStep(0);
  };

  // --- Social / Wallet simulated login ---
  const handleSocialLogin = async (provider: "google" | "apple" | "wallet") => {
    setError("");
    setLoading(true);

    if (provider === "wallet") {
      setView("wallet-creating");
      // Animate wallet creation steps
      setWalletStep(1);
      await delay(800);
      setWalletStep(2);
      await delay(600);
      setWalletStep(3);
      await delay(500);
    }

    try {
      const res = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setView("main");
        return;
      }

      if (provider === "wallet") {
        setWalletStep(4);
        await delay(400);
      }

      onAuth(data.user);
      onOpenChange(false);
      resetForm();
    } catch {
      setError("Network error. Please try again.");
      setView("main");
    } finally {
      setLoading(false);
    }
  };

  // --- Email auth ---
  const isSignup = view === "email-signup";
  const canSubmitEmail =
    email.includes("@") &&
    password.length >= 4 &&
    (!isSignup || (displayName.length >= 1 && username.length >= 2));

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitEmail || loading) return;
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const body = isSignup
        ? { email, password, displayName, username }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      onAuth(data.user);
      onOpenChange(false);
      resetForm();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    if (isSignup) {
      setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30));
    }
  };

  // --- Wallet creation animation view ---
  if (view === "wallet-creating") {
    const STEPS = [
      "Initializing secure connection...",
      "Creating your embedded wallet...",
      "Linking to your account...",
      "Wallet ready!",
    ];

    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-sm" showCloseButton={false}>
          <div className="flex flex-col items-center gap-6 py-6">
            {/* Animated wallet icon */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
              <WalletIcon className="h-10 w-10 text-primary-foreground" />
              {walletStep < 4 && (
                <div className="absolute -bottom-1 -right-1">
                  <Loader2Icon className="h-5 w-5 animate-spin text-secondary" />
                </div>
              )}
              {walletStep >= 4 && (
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-bold">
                {walletStep >= 4 ? "You're all set!" : "Setting up your wallet"}
              </p>
              <div className="flex flex-col items-center gap-1">
                {STEPS.slice(0, walletStep).map((step, i) => (
                  <p
                    key={i}
                    className={`text-sm transition-opacity duration-300 ${
                      i === walletStep - 1 && walletStep < 4
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {i < walletStep - 1 || walletStep >= 4 ? "\u2713 " : ""}{step}
                  </p>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              No seed phrases. No extensions.
              <br />
              Your wallet is embedded &amp; secure.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // --- Email form view ---
  if (view === "email-signup" || view === "email-login") {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          onOpenChange(v);
          if (!v) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isSignup ? "Create your account" : "Welcome back"}
            </DialogTitle>
            <DialogDescription>
              {isSignup
                ? "Sign up to contribute and earn collectible cards."
                : "Log in to continue your collection."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            {isSignup && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Display Name
                  </label>
                  <Input
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => handleDisplayNameChange(e.target.value)}
                    autoFocus
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Username
                  </label>
                  <Input
                    placeholder="yourname"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                      )
                    }
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus={!isSignup}
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={!canSubmitEmail || loading}
              className="w-full font-bold"
            >
              {loading
                ? "Processing..."
                : isSignup
                  ? "Sign Up"
                  : "Log In"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("email-login");
                    setError("");
                  }}
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
                  onClick={() => {
                    setView("email-signup");
                    setError("");
                  }}
                  className="font-bold text-secondary hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
            {" · "}
            <button
              type="button"
              onClick={() => {
                setView("main");
                setError("");
              }}
              className="font-bold text-secondary hover:underline"
            >
              Back
            </button>
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  // --- Main view: choose auth method ---
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Join LIAM
          </DialogTitle>
          <DialogDescription className="text-center">
            Contribute, earn cards, build your collection.
            <br />
            No seed phrases. No extensions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {/* Wallet — primary, highlighted */}
          <Button
            size="lg"
            className="w-full gap-2 font-bold hover:bg-liam-yellow-light"
            onClick={() => handleSocialLogin("wallet")}
            disabled={loading}
          >
            <WalletIcon className="h-4 w-4" />
            Continue with Wallet
          </Button>

          {/* Social options */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 gap-2 font-bold"
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 gap-2 font-bold"
              onClick={() => handleSocialLogin("apple")}
              disabled={loading}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-1">
              <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Signing in...</span>
            </div>
          )}

          {error && (
            <p className="text-center text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          {/* Divider */}
          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email options */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 gap-2 font-bold"
              onClick={() => setView("email-signup")}
              disabled={loading}
            >
              <MailIcon className="h-4 w-4" />
              Sign Up
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 gap-2 font-bold"
              onClick={() => setView("email-login")}
              disabled={loading}
            >
              <MailIcon className="h-4 w-4" />
              Log In
            </Button>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground">
          By continuing you agree to LIAM&apos;s Terms of Service.
          <br />
          Wallet powered by embedded smart accounts on Base.
        </p>
      </DialogContent>
    </Dialog>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
