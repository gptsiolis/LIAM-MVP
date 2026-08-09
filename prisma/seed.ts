import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
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
  // Relaxed thresholds for demo — produces a rich tier spread with ~40 people
  if (p >= 0.93) return "gold";
  if (p >= 0.88) return "purple";
  if (p >= 0.75) return "red";
  if (p >= 0.50) return "green";
  if (p >= 0.25) return "brown";
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
        title: "The Lord of the Rings: The Fellowship of the Ring",
        creatorId: "creator_ean",
        creatorName: "Peter Jackson",
        playbackUrl: "https://www.youtube.com/embed/V75dMMIW2B4",
        contributableUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.video.create({
      data: {
        title: "Neon Drift — Music Video",
        creatorId: "creator_ean",
        creatorName: "Ean Shen",
        playbackUrl: "https://www.youtube.com/embed/V75dMMIW2B4",
        contributableUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.video.create({
      data: {
        title: "The Last Garden — Documentary",
        creatorId: "creator_luna",
        creatorName: "Luna Park",
        playbackUrl: "https://www.youtube.com/embed/V75dMMIW2B4",
        contributableUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.video.create({
      data: {
        title: "Midnight Frequencies — Experimental",
        creatorId: "creator_rio",
        creatorName: "Rio Vasquez",
        playbackUrl: "https://www.youtube.com/embed/V75dMMIW2B4",
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
    { displayName: "Lena Volkov",     username: "lenav" },
    { displayName: "Dante Rossi",     username: "danter" },
    { displayName: "Hana Kim",        username: "hanak" },
    { displayName: "Tomás Herrera",   username: "tomash" },
    { displayName: "Rina Sato",       username: "rinas" },
    { displayName: "André Laurent",   username: "andrel" },
    { displayName: "Chloe Adebayo",   username: "chloea" },
    { displayName: "Ravi Patel",      username: "ravip" },
    { displayName: "Isla Brennan",    username: "islab" },
    { displayName: "Mateo Silva",     username: "mateos" },
    { displayName: "Yuki Tanabe",     username: "yukit" },
    { displayName: "Jordan Wells",    username: "jordanw" },
    { displayName: "Amara Osei",      username: "amarao" },
    { displayName: "Viktor Lund",     username: "viktorl" },
    { displayName: "Freya Andersen",  username: "freyaa" },
    { displayName: "Niko Alexiou",    username: "nikoa" },
    { displayName: "Suki Chang",      username: "sukic" },
    { displayName: "Diego Fuentes",   username: "diegof" },
    { displayName: "Aisha Mbeki",     username: "aisham" },
    { displayName: "Callum Fraser",   username: "callumf" },
    { displayName: "Mira Johansson",  username: "miraj" },
    { displayName: "Remy Dubois",     username: "remyd" },
    { displayName: "Zara Hussain",    username: "zarah" },
    { displayName: "Theo Papadakis",  username: "theop" },
    { displayName: "Ingrid Solberg",  username: "ingrids" },
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
    // 40 contributions — rich tier spread
    [0, "mayat",     100000, "Masterpiece. Ean never disappoints.",      336],
    [0, "danter",     75000, "This changed my life. Funding the future.",312],
    [0, "andrel",     60000, "Cinema at its absolute peak.",             288],
    [0, "jpark",      25000, "Love this film!",                         264],
    [0, "hanak",      22000, "Cried three times. Take my money.",        240],
    [0, "ariachen",   18000, "Beautiful cinematography",                 216],
    [0, "lenav",      15000, "Ean is the voice of our generation.",      192],
    [0, "tomash",     12000, "Haunting and beautiful.",                   180],
    [0, "rinas",      10000, "Every frame a painting.",                   168],
    [0, "leokwame",    8000, "Great work",                               156],
    [0, "ravip",       7500, "Shared this with everyone I know.",         144],
    [0, "sofiar",      6000, null,                                       132],
    [0, "islab",       5000, "Extraordinary storytelling.",               120],
    [0, "kainaka",     4500, "Really moving story",                      108],
    [0, "mateos",      4000, "The ending broke me.",                       96],
    [0, "yukit",       3500, null,                                         90],
    [0, "zoew",        3000, null,                                         84],
    [0, "jordanw",     2500, "This is why I love LIAM.",                   78],
    [0, "finnob",      2500, "Shared with all my friends",                 72],
    [0, "amarao",      2000, "Stunning. Just stunning.",                   66],
    [0, "viktorl",     2000, null,                                         60],
    [0, "freyaa",      1500, "Wow.",                                       54],
    [0, "nikoa",       1500, null,                                         48],
    [0, "priyas",      1000, "First contribution on LIAM!",                42],
    [0, "sukic",       1000, null,                                         38],
    [0, "marcusj",      800, null,                                         34],
    [0, "diegof",       700, "Incredible short film.",                     30],
    [0, "aisham",       600, null,                                         26],
    [0, "elliet",       500, "Beautiful.",                                  22],
    [0, "callumf",      500, null,                                         20],
    [0, "chloea",       400, "Love from Lagos!",                           18],
    [0, "devo",         400, null,                                         16],
    [0, "miraj",        300, null,                                         14],
    [0, "remyd",        300, "Magnifique.",                                12],
    [0, "samr",         250, null,                                         10],
    [0, "ninap",        200, null,                                          8],
    [0, "oscarc",       200, null,                                          6],
    [0, "zarah",        150, "Great film!",                                 4],
    [0, "theop",        100, null,                                          3],
    [0, "ingrids",      100, null,                                          1],

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
