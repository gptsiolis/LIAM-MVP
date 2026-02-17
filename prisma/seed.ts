import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.creatorCard.deleteMany();
  await prisma.videoCard.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.video.deleteMany();
  await prisma.user.deleteMany();

  // Create demo video
  const video = await prisma.video.create({
    data: {
      title: "Echoes of Tomorrow — Short Film",
      creatorId: "creator_ean",
      creatorName: "Ean Shen",
      playbackUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      contributableUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  });

  console.log(`Created demo video: ${video.title} (${video.id})`);

  // Create some fake supporters with pre-seeded contributions
  const supporters = [
    { displayName: "Maya Torres", username: "mayat", amount: 10000 },
    { displayName: "James Park", username: "jpark", amount: 5000 },
    { displayName: "Aria Chen", username: "ariachen", amount: 2500 },
    { displayName: "Leo Kwame", username: "leokwame", amount: 1000 },
    { displayName: "Sofia Reyes", username: "sofiar", amount: 500 },
    { displayName: "Kai Nakamura", username: "kainaka", amount: 500 },
    { displayName: "Zoe Williams", username: "zoew", amount: 200 },
    { displayName: "Finn O'Brien", username: "finnob", amount: 200 },
  ];

  for (const s of supporters) {
    const user = await prisma.user.create({
      data: {
        email: `${s.username}@demo.liam.app`,
        passwordHash: "seeded_demo_user",
        username: s.username,
        displayName: s.displayName,
      },
    });

    const contribution = await prisma.contribution.create({
      data: {
        userId: user.id,
        videoId: video.id,
        amountCents: s.amount,
        message:
          s.amount >= 5000
            ? "Love this film!"
            : s.amount >= 1000
              ? "Great work 🎬"
              : null,
      },
    });

    await prisma.videoCard.create({
      data: {
        userId: user.id,
        videoId: video.id,
        contributionId: contribution.id,
        currentTier: "grey", // will be recomputed
      },
    });
  }

  // Recompute tiers
  const allContributions = await prisma.contribution.findMany({
    where: { videoId: video.id },
    select: { userId: true, amountCents: true },
  });

  const userTotals = new Map<string, number>();
  for (const c of allContributions) {
    userTotals.set(c.userId, (userTotals.get(c.userId) ?? 0) + c.amountCents);
  }

  const userIds = [...userTotals.keys()];
  const amounts = userIds.map((uid) => userTotals.get(uid)!);
  const n = amounts.length;

  // Sort by amount desc for percentile calc
  const indexed = amounts.map((amount, i) => ({ amount, i }));
  indexed.sort((a, b) => b.amount - a.amount || a.i - b.i);
  const percentiles = new Array<number>(n);
  for (let rank = 0; rank < n; rank++) {
    percentiles[indexed[rank].i] = (n - rank) / n;
  }

  function tierFromPercentile(p: number): string {
    if (p >= 0.999) return "gold";
    if (p >= 0.99) return "purple";
    if (p >= 0.9) return "red";
    if (p >= 0.75) return "green";
    if (p >= 0.5) return "brown";
    return "grey";
  }

  const userTierMap = new Map<string, string>();
  userIds.forEach((uid, i) => {
    userTierMap.set(uid, tierFromPercentile(percentiles[i]));
  });

  const allCards = await prisma.videoCard.findMany({
    where: { videoId: video.id },
    select: { id: true, userId: true },
  });

  for (const card of allCards) {
    const tier = userTierMap.get(card.userId) ?? "grey";
    await prisma.videoCard.update({
      where: { id: card.id },
      data: { currentTier: tier },
    });
  }

  // Create creator cards
  const year = new Date().getFullYear();
  for (const [userId, total] of userTotals) {
    const tier = userTierMap.get(userId) ?? "grey";
    await prisma.creatorCard.create({
      data: {
        userId,
        creatorId: video.creatorId,
        year,
        totalAmountCents: total,
        currentTier: tier,
      },
    });
  }

  console.log(`Seeded ${supporters.length} supporters with cards and tiers`);
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
