import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  // Get the first (demo) video
  const video = await prisma.video.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!video) {
    return NextResponse.json({ video: null, supporters: [] });
  }

  // Get all video cards with user + contribution data
  const cards = await prisma.videoCard.findMany({
    where: { videoId: video.id },
    include: {
      user: { select: { displayName: true, username: true, avatarUrl: true } },
      contribution: { select: { amountCents: true, message: true, createdAt: true } },
    },
    orderBy: { mintedAt: "desc" },
  });

  const supporters = cards.map((c) => ({
    id: c.id,
    username: c.user.username,
    displayName: c.user.displayName,
    avatarUrl: c.user.avatarUrl,
    amountCents: c.contribution.amountCents,
    tier: c.currentTier,
    message: c.contribution.message,
    createdAt: c.contribution.createdAt.toISOString(),
  }));

  // Stats
  const totalRaised = cards.reduce((sum, c) => sum + c.contribution.amountCents, 0);

  return NextResponse.json({
    video: {
      id: video.id,
      title: video.title,
      creatorName: video.creatorName,
      creatorId: video.creatorId,
      playbackUrl: video.playbackUrl,
      contributableUntil: video.contributableUntil.toISOString(),
    },
    supporters,
    totalRaised,
  });
}
