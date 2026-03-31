"use client";

import type { TierSlug } from "@/components/CardBadge";
import { TIER_HEX } from "@/components/FlipCard";

interface SidebarVideo {
  id: string;
  title: string;
  creator: string;
  raised: string;
  duration: string;
  thumbnail: string;
  friend?: {
    name: string;
    tier: TierSlug;
  };
}

const TIER_LABELS: Record<TierSlug, string> = {
  grey: "Grey",
  brown: "Brown",
  green: "Green",
  red: "Red",
  purple: "Purple",
  gold: "Gold",
};

const VIDEOS: SidebarVideo[] = [
  {
    id: "1",
    title: "Oppenheimer",
    creator: "Christopher Nolan",
    raised: "$312M",
    duration: "3:00:28",
    thumbnail: "https://img.youtube.com/vi/uYPbbksJxIg/hqdefault.jpg",
    friend: { name: "Sarah", tier: "gold" },
  },
  {
    id: "2",
    title: "Interstellar",
    creator: "Christopher Nolan",
    raised: "$187M",
    duration: "2:49:00",
    thumbnail: "https://img.youtube.com/vi/zSWdZVtXT7E/hqdefault.jpg",
  },
  {
    id: "3",
    title: "Breaking Bad: Ozymandias",
    creator: "Vince Gilligan",
    raised: "$94M",
    duration: "47:12",
    thumbnail: "https://img.youtube.com/vi/HhesaQXLuRY/hqdefault.jpg",
    friend: { name: "Marcus", tier: "purple" },
  },
  {
    id: "4",
    title: "The Dark Knight",
    creator: "Christopher Nolan",
    raised: "$441M",
    duration: "2:32:00",
    thumbnail: "https://img.youtube.com/vi/EXeTwQWrcwY/hqdefault.jpg",
  },
  {
    id: "5",
    title: "Parasite",
    creator: "Bong Joon-ho",
    raised: "$263M",
    duration: "2:12:00",
    thumbnail: "https://img.youtube.com/vi/5xH0HfJHsaY/hqdefault.jpg",
    friend: { name: "Yuna", tier: "red" },
  },
  {
    id: "6",
    title: "Squid Game: Red Light, Green Light",
    creator: "Hwang Dong-hyuk",
    raised: "$78M",
    duration: "59:48",
    thumbnail: "https://img.youtube.com/vi/oqxAJKy0ii4/hqdefault.jpg",
  },
  {
    id: "7",
    title: "The Bear: Yes Chef",
    creator: "Christopher Storer",
    raised: "$41M",
    duration: "28:34",
    thumbnail: "https://img.youtube.com/vi/y-cqqAJIXhs/hqdefault.jpg",
    friend: { name: "Jordan", tier: "green" },
  },
  {
    id: "8",
    title: "Everything Everywhere All at Once",
    creator: "Daniels",
    raised: "$107M",
    duration: "2:19:00",
    thumbnail: "https://img.youtube.com/vi/wxN1T1qdTBI/hqdefault.jpg",
  },
  {
    id: "9",
    title: "Dune: Part Two",
    creator: "Denis Villeneuve",
    raised: "$156M",
    duration: "2:46:00",
    thumbnail: "https://img.youtube.com/vi/Way9Dexny3w/hqdefault.jpg",
    friend: { name: "Priya", tier: "brown" },
  },
  {
    id: "10",
    title: "Succession: With Open Eyes",
    creator: "Jesse Armstrong",
    raised: "$58M",
    duration: "1:22:00",
    thumbnail: "https://img.youtube.com/vi/OzYxJV_rmE8/hqdefault.jpg",
  },
  {
    id: "11",
    title: "No Country for Old Men",
    creator: "Coen Brothers",
    raised: "$74M",
    duration: "2:02:00",
    thumbnail: "https://img.youtube.com/vi/38A__WT3-o0/hqdefault.jpg",
    friend: { name: "Lena", tier: "grey" },
  },
  {
    id: "12",
    title: "The Social Network",
    creator: "David Fincher",
    raised: "$224M",
    duration: "2:00:00",
    thumbnail: "https://img.youtube.com/vi/lB95KLmpLR4/hqdefault.jpg",
  },
  {
    id: "13",
    title: "Severance: The We We Are",
    creator: "Dan Erickson",
    raised: "$33M",
    duration: "52:18",
    thumbnail: "https://img.youtube.com/vi/xEQP4VVuyrY/hqdefault.jpg",
    friend: { name: "Kai", tier: "purple" },
  },
  {
    id: "14",
    title: "Mad Max: Fury Road",
    creator: "George Miller",
    raised: "$389M",
    duration: "2:00:00",
    thumbnail: "https://img.youtube.com/vi/hEJnMQG9ev8/hqdefault.jpg",
  },
  {
    id: "15",
    title: "Moonlight",
    creator: "Barry Jenkins",
    raised: "$65M",
    duration: "1:51:00",
    thumbnail: "https://img.youtube.com/vi/9NJj12tiBzc/hqdefault.jpg",
    friend: { name: "Dante", tier: "gold" },
  },
  {
    id: "16",
    title: "Blade Runner 2049",
    creator: "Denis Villeneuve",
    raised: "$178M",
    duration: "2:44:00",
    thumbnail: "https://img.youtube.com/vi/gCcx85zbxz4/hqdefault.jpg",
  },
  {
    id: "17",
    title: "Shogun: Anjin",
    creator: "Rachel Kondo",
    raised: "$52M",
    duration: "1:01:22",
    thumbnail: "https://img.youtube.com/vi/u1IBH_jNETc/hqdefault.jpg",
    friend: { name: "Rina", tier: "red" },
  },
  {
    id: "18",
    title: "Get Out",
    creator: "Jordan Peele",
    raised: "$255M",
    duration: "1:44:00",
    thumbnail: "https://img.youtube.com/vi/DzfpyUB60YY/hqdefault.jpg",
  },
  {
    id: "19",
    title: "The Last of Us: Long Long Time",
    creator: "Craig Mazin",
    raised: "$89M",
    duration: "1:16:00",
    thumbnail: "https://img.youtube.com/vi/uLtkt8BonwM/hqdefault.jpg",
    friend: { name: "Tomás", tier: "green" },
  },
  {
    id: "20",
    title: "Whiplash",
    creator: "Damien Chazelle",
    raised: "$143M",
    duration: "1:47:00",
    thumbnail: "https://img.youtube.com/vi/7d_jQycdQGo/hqdefault.jpg",
  },
];

export function RecommendedSidebar() {
  return (
    <aside>
      <h3 className="mb-4 text-sm font-extrabold uppercase tracking-widest">
        Up next
      </h3>

      <div className="flex flex-col gap-3">
        {VIDEOS.map((video) => {
          const isFriend = !!video.friend;
          const tierColor = video.friend
            ? TIER_HEX[video.friend.tier]
            : undefined;

          return (
            <a
              key={video.id}
              href="#"
              className="group flex gap-3 rounded-lg p-1.5 transition-colors hover:bg-muted/60"
              style={
                isFriend
                  ? { backgroundColor: `${tierColor}08` }
                  : undefined
              }
            >
              {/* Thumbnail */}
              <div
                className="relative w-[168px] shrink-0 overflow-hidden rounded"
                style={
                  isFriend
                    ? { border: `3px solid ${tierColor}` }
                    : undefined
                }
              >
                <div className="aspect-video bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Duration badge */}
                <span className="absolute bottom-1 right-1 rounded bg-liam-black/80 px-1 py-0.5 text-[10px] font-bold text-white">
                  {video.duration}
                </span>

                {/* Friend mint badge */}
                {video.friend && (
                  <span
                    className="absolute left-0 top-0 px-1.5 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: tierColor }}
                  >
                    {video.friend.name} &middot;{" "}
                    {TIER_LABELS[video.friend.tier]}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex min-w-0 flex-col">
                <p className="text-[13px] font-bold leading-snug line-clamp-2 group-hover:text-secondary">
                  {video.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {video.creator}
                </p>
                <p className="text-xs text-muted-foreground">
                  {video.raised} raised
                </p>
                {video.friend && (
                  <p
                    className="mt-1 text-[10px] font-bold"
                    style={{ color: tierColor }}
                  >
                    {video.friend.name} earned a{" "}
                    {TIER_LABELS[video.friend.tier]} Card
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
