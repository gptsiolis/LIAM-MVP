"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { contributeSchema } from "@/lib/validators";
import { computePercentiles, getTierFromPercentile } from "@/lib/tiers";

export interface ContributeResult {
  success: boolean;
  error?: string;
  card?: {
    id: string;
    tier: string;
    tierName: string;
    amountCents: number;
    videoTitle: string;
    displayName: string;
    mintedAt: string;
  };
}

export async function contribute(input: {
  videoId: string;
  amountCents: number;
  message?: string;
}): Promise<ContributeResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = contributeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const { videoId, amountCents, message } = parsed.data;

  // Verify video exists and is still open
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video) {
    return { success: false, error: "Video not found" };
  }
  if (new Date() > video.contributableUntil) {
    return { success: false, error: "Contributions are closed for this video" };
  }

  // === Simulated payment processing ===
  // In production: call Stripe / on-chain USDC transfer here
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Create contribution + mint card in a transaction
  const contribution = await prisma.contribution.create({
    data: {
      userId: session.userId,
      videoId,
      amountCents,
      message: message || null,
    },
  });

  const card = await prisma.videoCard.create({
    data: {
      userId: session.userId,
      videoId,
      contributionId: contribution.id,
      currentTier: "grey", // temporary, will be recomputed below
    },
  });

  // === Recompute tiers based on PER-USER TOTAL for this video ===
  // Group contributions by user, sum amounts → rank by user total
  const allContributions = await prisma.contribution.findMany({
    where: { videoId },
    select: { id: true, userId: true, amountCents: true },
  });

  // Sum per user
  const userTotals = new Map<string, number>();
  for (const c of allContributions) {
    userTotals.set(c.userId, (userTotals.get(c.userId) ?? 0) + c.amountCents);
  }

  // Compute percentiles for unique users
  const userIds = [...userTotals.keys()];
  const userAmounts = userIds.map((uid) => userTotals.get(uid)!);
  const userPercentiles = computePercentiles(userAmounts);

  // Build userId → percentile map
  const userPercentileMap = new Map<string, number>();
  userIds.forEach((uid, i) => {
    userPercentileMap.set(uid, userPercentiles[i]);
  });

  // Update every VideoCard's tier based on their user's percentile
  const allCards = await prisma.videoCard.findMany({
    where: { videoId },
    select: { id: true, userId: true },
  });

  for (const vc of allCards) {
    const percentile = userPercentileMap.get(vc.userId) ?? 0;
    const tier = getTierFromPercentile(percentile);
    await prisma.videoCard.update({
      where: { id: vc.id },
      data: { currentTier: tier.slug, tierUpdatedAt: new Date() },
    });
  }

  // === Update CreatorCard aggregate ===
  const year = new Date().getFullYear();
  const userTotal = await prisma.contribution.aggregate({
    where: { userId: session.userId, video: { creatorId: video.creatorId } },
    _sum: { amountCents: true },
  });

  await prisma.creatorCard.upsert({
    where: {
      userId_creatorId_year: {
        userId: session.userId,
        creatorId: video.creatorId,
        year,
      },
    },
    update: {
      totalAmountCents: userTotal._sum.amountCents ?? 0,
      currentTier: "grey", // will recompute below
      tierUpdatedAt: new Date(),
    },
    create: {
      userId: session.userId,
      creatorId: video.creatorId,
      year,
      totalAmountCents: userTotal._sum.amountCents ?? 0,
      currentTier: "grey",
    },
  });

  // Recompute creator card tiers for all users for this creator+year
  const allCreatorCards = await prisma.creatorCard.findMany({
    where: { creatorId: video.creatorId, year },
    select: { id: true, totalAmountCents: true },
  });

  const creatorAmounts = allCreatorCards.map((c) => c.totalAmountCents);
  const creatorPercentiles = computePercentiles(creatorAmounts);

  for (let i = 0; i < allCreatorCards.length; i++) {
    const tier = getTierFromPercentile(creatorPercentiles[i]);
    await prisma.creatorCard.update({
      where: { id: allCreatorCards[i].id },
      data: { currentTier: tier.slug, tierUpdatedAt: new Date() },
    });
  }

  // Get the final tier for the current user's card
  const userPercentile = userPercentileMap.get(session.userId) ?? 1;
  const finalTier = getTierFromPercentile(userPercentile);

  return {
    success: true,
    card: {
      id: card.id,
      tier: finalTier.slug,
      tierName: finalTier.name,
      amountCents,
      videoTitle: video.title,
      displayName: session.displayName,
      mintedAt: card.mintedAt.toISOString(),
    },
  };
}
