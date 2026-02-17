import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Simulated social / wallet login for MVP demo.
 *
 * Accepts a `provider` ("google" | "apple" | "wallet") and auto-creates
 * a user with generated credentials.  No real OAuth — just gives the
 * demo the feel of an embedded-wallet onboarding flow.
 */
export async function POST(req: Request) {
  try {
    const { provider } = (await req.json()) as { provider: string };

    if (!["google", "apple", "wallet"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    // Generate a random short id for uniqueness
    const rid = Math.random().toString(36).slice(2, 8);

    const NAMES: Record<string, string[]> = {
      google: ["Alex Rivera", "Jordan Chen", "Sam Okafor", "Taylor Kim", "Casey Brooks"],
      apple: ["Morgan Liu", "Riley Patel", "Avery Santos", "Drew Nakamura", "Quinn Webb"],
      wallet: ["Anon Collector", "Based Minter", "Card Hunter", "Pixel Scout", "Rarity Seeker"],
    };

    const pool = NAMES[provider] ?? NAMES.google;
    const displayName = pool[Math.floor(Math.random() * pool.length)];
    const username = displayName.toLowerCase().replace(/[^a-z0-9]/g, "") + rid;
    const email = `${username}@${provider}.liam.demo`;

    // Create user (no password needed for social/wallet — demo only)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: "social_login_no_password",
        username,
        displayName,
      },
    });

    await createSession({
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      username: user.username,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
      provider,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
