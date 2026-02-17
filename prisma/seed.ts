import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

// --- Tier logic (mirrors src/lib/tiers.ts) ---
function computePercentiles(amounts: number[]): number[] {
  const n = amounts.length;
  if (n === 0) return [];
  if (n === 1) return [1.0];
  const indexed = amounts.map((amount, i) => ({ amount, i }));
  indexed.sort((a, b) => b.amount - a.amount || a.i - b.i);
  const percentiles = new Array<number>(n);
  for (let rank = 0; rank < n; rank++) {
    percentiles[indexed[rank].i] = (n - rank) / n;
  }
  return percentiles;
}

function tierFromPercentile(p: number): string {
  if (p >= 0.999) return "gold";
  if (p >= 0.99) return "purple";
  if (p >= 0.9) return "red";
  if (p >= 0.75) return "green";
  if (p >= 0.5) return "brown";
  return "grey";
}

// --- Helpers ---
function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}

async function main() {
  console.log("Cleaning existing data...");
  await prisma.creatorCard.deleteMany();
  await prisma.videoCard.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.video.deleteMany();
  await prisma.user.deleteMany();

  // ============================================================
  // CREATORS & VIDEOS
  // ============================================================
  const videos = await Promise.all([
    prisma.video.create({
      data: {
        title: "Echoes of Tomorrow — Short Film",
        creatorId: "creator_ean",
        creatorName: "Ean Shen",
        playbackUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        contributableUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.video.create({
      data: {
        title: "Neon Drift — Music Video",
        creatorId: "creator_ean",
        creatorName: "Ean Shen",
        playbackUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        contributableUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.video.create({
      data: {
        title: "The Last Garden — Documentary",
        creatorId: "creator_luna",
        creatorName: "Luna Park",
        playbackUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        contributableUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.video.create({
      data: {
        title: "Midnight Frequencies — Experimental",
        creatorId: "creator_rio",
        creatorName: "Rio Vasquez",
        playbackUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        contributableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log(`Created ${videos.length} videos`);

  // ============================================================
  // USERS (15 varied)
  // ============================================================
  const usersData = [
    { displayName: "Maya Torres",     username: "mayat" },
    { displayName: "James Park",      username: "jpark" },
    { displayName: "Aria Chen",       username: "ariachen" },
    { displayName: "Leo Kwame",       username: "leokwame" },
    { displayName: "Sofia Reyes",     username: "sofiar" },
    { displayName: "Kai Nakamura",    username: "kainaka" },
    { displayName: "Zoe Williams",    username: "zoew" },
    { displayName: "Finn O'Brien",    username: "finnob" },
    { displayName: "Priya Sharma",    username: "priyas" },
    { displayName: "Marcus Johnson",  username: "marcusj" },
    { displayName: "Ellie Tanaka",    username: "elliet" },
    { displayName: "Dev Okonkwo",     username: "devo" },
    { displayName: "Sam Rivera",      username: "samr" },
    { displayName: "Nina Petrov",     username: "ninap" },
    { displayName: "Oscar Chen",      username: "oscarc" },
  ];

  const users: { id: string; username: string }[] = [];
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: {
        email: `${u.username}@demo.liam.app`,
        passwordHash: "seeded_demo_user",
        username: u.username,
        displayName: u.displayName,
      },
    });
    users.push({ id: user.id, username: u.username });
  }
  console.log(`Created ${users.length} users`);

  // Helper to look up user by username
  const uid = (username: string) => users.find((u) => u.username === username)!.id;

  // ============================================================
  // CONTRIBUTIONS — spread across videos with realistic variety
  // ============================================================
  // [videoIndex, username, amountCents, message | null, hoursAgo]
  type ContribRow = [number, string, number, string | null, number];
  const contribs: ContribRow[] = [
    // --- Video 0: "Echoes of Tomorrow" (main landing page video) ---
    // 12 contributions, wide tier spread
    [0, "mayat",     50000, "Masterpiece. Ean never disappoints.",      168],
    [0, "jpark",     10000, "Love this film!",                         144],
    [0, "ariachen",   5000, "Beautiful cinematography",                 120],
    [0, "leokwame",   2500, "Great work 🎬",                            96],
    [0, "sofiar",     1000, null,                                        72],
    [0, "kainaka",    1000, "Really moving story",                       48],
    [0, "zoew",        500, null,                                        36],
    [0, "finnob",      500, "Shared with all my friends",                24],
    [0, "priyas",      200, "First contribution on LIAM!",               18],
    [0, "marcusj",     200, null,                                        12],
    [0, "elliet",      100, null,                                         6],
    [0, "devo",        100, null,                                         2],

    // --- Video 1: "Neon Drift" (same creator: Ean Shen) ---
    // 8 contributions, some overlapping users
    [1, "mayat",     20000, "The colors in this are insane",             96],
    [1, "ariachen",   3000, "Vibes for days",                            72],
    [1, "samr",       2000, "New fan of Ean's work",                     48],
    [1, "ninap",      1500, null,                                        36],
    [1, "kainaka",     500, "Music selection is perfect",                24],
    [1, "oscarc",      300, null,                                        12],
    [1, "zoew",        200, null,                                         8],
    [1, "leokwame",    100, null,                                         4],

    // --- Video 2: "The Last Garden" (creator: Luna Park) ---
    // 6 contributions
    [2, "mayat",     15000, "Luna's best work yet. Tears.",             120],
    [2, "jpark",      5000, "So important 🌱",                           72],
    [2, "sofiar",     2000, "Made me rethink everything",                48],
    [2, "priyas",      500, null,                                        24],
    [2, "marcusj",     300, "Gorgeous",                                  12],
    [2, "devo",        100, null,                                         6],

    // --- Video 3: "Midnight Frequencies" (creator: Rio Vasquez) ---
    // 5 contributions
    [3, "elliet",     8000, "Rio is a genius. Period.",                   96],
    [3, "finnob",     3000, "This is the future of music film",          48],
    [3, "samr",       1000, null,                                        24],
    [3, "ninap",       500, "Hypnotic",                                  12],
    [3, "oscarc",      200, null,                                         4],
  ];

  // Insert contributions and mint cards
  for (const [vi, username, amountCents, message, hAgo] of contribs) {
    const userId = uid(username);
    const videoId = videos[vi].id;

    const contribution = await prisma.contribution.create({
      data: {
        userId,
        videoId,
        amountCents,
        message: message || null,
        createdAt: hoursAgo(hAgo),
      },
    });

    await prisma.videoCard.create({
      data: {
        userId,
        videoId,
        contributionId: contribution.id,
        currentTier: "grey", // recomputed below
        mintedAt: hoursAgo(hAgo),
      },
    });
  }
  console.log(`Created ${contribs.length} contributions with cards`);

  // ============================================================
  // RECOMPUTE TIERS per video (using per-user sum)
  // ============================================================
  for (const video of videos) {
    const videoContribs = await prisma.contribution.findMany({
      where: { videoId: video.id },
      select: { userId: true, amountCents: true },
    });

    // Sum per user
    const userTotals = new Map<string, number>();
    for (const c of videoContribs) {
      userTotals.set(c.userId, (userTotals.get(c.userId) ?? 0) + c.amountCents);
    }

    const userIds = [...userTotals.keys()];
    const amounts = userIds.map((u) => userTotals.get(u)!);
    const percentiles = computePercentiles(amounts);

    const userTierMap = new Map<string, string>();
    userIds.forEach((u, i) => {
      userTierMap.set(u, tierFromPercentile(percentiles[i]));
    });

    // Update video cards
    const videoCards = await prisma.videoCard.findMany({
      where: { videoId: video.id },
      select: { id: true, userId: true },
    });

    for (const vc of videoCards) {
      await prisma.videoCard.update({
        where: { id: vc.id },
        data: { currentTier: userTierMap.get(vc.userId) ?? "grey" },
      });
    }

    const tierCounts: Record<string, number> = {};
    for (const t of userTierMap.values()) {
      tierCounts[t] = (tierCounts[t] ?? 0) + 1;
    }
    console.log(`  ${video.title}: ${userIds.length} unique supporters → ${JSON.stringify(tierCounts)}`);
  }

  // ============================================================
  // CREATOR CARDS (yearly aggregates per user per creator)
  // ============================================================
  const year = new Date().getFullYear();
  const creatorIds = [...new Set(videos.map((v) => v.creatorId))];

  for (const creatorId of creatorIds) {
    const creatorVideos = videos.filter((v) => v.creatorId === creatorId);
    const creatorVideoIds = creatorVideos.map((v) => v.id);

    // Get all contributions to this creator's videos
    const creatorContribs = await prisma.contribution.findMany({
      where: { videoId: { in: creatorVideoIds } },
      select: { userId: true, amountCents: true },
    });

    // Sum per user
    const userTotals = new Map<string, number>();
    for (const c of creatorContribs) {
      userTotals.set(c.userId, (userTotals.get(c.userId) ?? 0) + c.amountCents);
    }

    const userIds = [...userTotals.keys()];
    const amounts = userIds.map((u) => userTotals.get(u)!);
    const percentiles = computePercentiles(amounts);

    for (let i = 0; i < userIds.length; i++) {
      const tier = tierFromPercentile(percentiles[i]);
      await prisma.creatorCard.create({
        data: {
          userId: userIds[i],
          creatorId,
          year,
          totalAmountCents: userTotals.get(userIds[i])!,
          currentTier: tier,
        },
      });
    }

    console.log(`  Creator ${creatorId}: ${userIds.length} aggregate cards`);
  }

  // ============================================================
  // FOLLOWS (some social connections for future taste curation)
  // ============================================================
  const follows: [string, string][] = [
    ["mayat", "jpark"],
    ["mayat", "ariachen"],
    ["jpark", "mayat"],
    ["ariachen", "mayat"],
    ["sofiar", "leokwame"],
    ["kainaka", "zoew"],
    ["elliet", "finnob"],
    ["samr", "ninap"],
  ];

  for (const [follower, following] of follows) {
    await prisma.follow.create({
      data: { followerId: uid(follower), followingId: uid(following) },
    });
  }
  console.log(`Created ${follows.length} follow relationships`);

  console.log("\nSeed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
