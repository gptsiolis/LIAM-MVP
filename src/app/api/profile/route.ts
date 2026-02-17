import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      displayName: true,
      username: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch video cards with video + contribution details
  const videoCards = await prisma.videoCard.findMany({
    where: { userId: session.userId },
    include: {
      video: { select: { title: true, creatorName: true } },
      contribution: { select: { amountCents: true, createdAt: true } },
    },
    orderBy: { mintedAt: "desc" },
  });

  // Fetch creator aggregate cards
  const creatorCards = await prisma.creatorCard.findMany({
    where: { userId: session.userId },
    orderBy: { year: "desc" },
  });

  // Stats
  const totalContributed = videoCards.reduce(
    (sum, c) => sum + c.contribution.amountCents,
    0
  );

  return NextResponse.json({
    user: {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      joinedAt: user.createdAt.toISOString(),
    },
    videoCards: videoCards.map((vc) => ({
      id: vc.id,
      videoTitle: vc.video.title,
      creatorName: vc.video.creatorName,
      amountCents: vc.contribution.amountCents,
      tier: vc.currentTier,
      mintedAt: vc.mintedAt.toISOString(),
    })),
    creatorCards: creatorCards.map((cc) => ({
      id: cc.id,
      creatorId: cc.creatorId,
      year: cc.year,
      totalAmountCents: cc.totalAmountCents,
      tier: cc.currentTier,
    })),
    stats: {
      totalCards: videoCards.length,
      totalContributed,
      creatorsSupported: new Set(videoCards.map((vc) => vc.video.creatorName))
        .size,
    },
  });
}
