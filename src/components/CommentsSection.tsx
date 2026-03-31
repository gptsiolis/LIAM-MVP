"use client";

import { useState } from "react";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import type { TierSlug } from "@/components/CardBadge";
import { TIER_HEX } from "@/components/FlipCard";

interface Comment {
  id: string;
  name: string;
  initial: string;
  tier?: TierSlug;
  timeAgo: string;
  text: string;
  likes: number;
  replies?: Comment[];
}

const COMMENTS: Comment[] = [
  {
    id: "c1",
    name: "Lena Volkov",
    initial: "L",
    timeAgo: "2 days ago",
    text: "I've watched this four times now. Every single time I catch something new. The sound design alone is worth the contribution. Ean is operating on a different level.",
    likes: 342,
    replies: [
      {
        id: "c1r1",
        name: "Dante Rossi",
        initial: "D",
        tier: "gold",
        timeAgo: "1 day ago",
        text: "The sound design in the third act is INSANE. That low hum during the mirror scene gave me chills.",
        likes: 87,
      },
      {
        id: "c1r2",
        name: "Hana Kim",
        initial: "H",
        tier: "purple",
        timeAgo: "22 hours ago",
        text: "Same. The way the score drops out completely at 14:32 and it's just ambient noise... masterclass.",
        likes: 41,
      },
    ],
  },
  {
    id: "c2",
    name: "André Laurent",
    initial: "A",
    tier: "gold",
    timeAgo: "3 days ago",
    text: "This is what happens when you let artists get paid directly by their audience instead of going through studios. The creative freedom shows in every frame. LIAM is doing something important here.",
    likes: 518,
    replies: [
      {
        id: "c2r1",
        name: "Isla Brennan",
        initial: "I",
        timeAgo: "2 days ago",
        text: "Exactly this. No notes from executives, no focus groups, just pure vision. This is the future.",
        likes: 103,
      },
    ],
  },
  {
    id: "c3",
    name: "Ravi Patel",
    initial: "R",
    tier: "red",
    timeAgo: "5 days ago",
    text: "Contributed $75 and got a Red Card. Honestly would have paid more. This is better than most things I've seen in theaters this year.",
    likes: 204,
  },
  {
    id: "c4",
    name: "Yuki Tanabe",
    initial: "Y",
    timeAgo: "1 week ago",
    text: "The cinematography reminds me of early Villeneuve but with its own identity. That long take through the hallway at the 8 minute mark is going to be studied in film schools.",
    likes: 156,
    replies: [
      {
        id: "c4r1",
        name: "Mateo Silva",
        initial: "M",
        timeAgo: "6 days ago",
        text: "I thought the same thing! Very Sicario-esque but somehow more intimate.",
        likes: 29,
      },
    ],
  },
  {
    id: "c5",
    name: "Jordan Wells",
    initial: "J",
    timeAgo: "4 days ago",
    text: "My friend Sarah told me about this and I'm so glad she did. Already shared it with my entire group chat. This deserves way more eyes on it.",
    likes: 89,
  },
  {
    id: "c6",
    name: "Amara Osei",
    initial: "A",
    tier: "green",
    timeAgo: "1 week ago",
    text: "The ending absolutely wrecked me. I just sat in silence for a full minute after it finished. Didn't even want to scroll. That's how you know it's real.",
    likes: 431,
    replies: [
      {
        id: "c6r1",
        name: "Viktor Lund",
        initial: "V",
        timeAgo: "6 days ago",
        text: "Same experience. I was on the train and had to just... stare out the window for a while.",
        likes: 67,
      },
      {
        id: "c6r2",
        name: "Freya Andersen",
        initial: "F",
        timeAgo: "5 days ago",
        text: "That final shot with the light through the window. Poetry.",
        likes: 54,
      },
    ],
  },
  {
    id: "c7",
    name: "Niko Alexiou",
    initial: "N",
    timeAgo: "3 days ago",
    text: "Just contributed. The pay-what-you-want model is genius. I'd rather give $25 directly to the filmmaker than $15 to a theater where the creator sees $0.30.",
    likes: 276,
  },
  {
    id: "c8",
    name: "Suki Chang",
    initial: "S",
    tier: "brown",
    timeAgo: "2 days ago",
    text: "Anyone else notice the color grading shifts from cool to warm as the character's arc progresses? Subtle but once you see it you can't unsee it.",
    likes: 112,
  },
  {
    id: "c9",
    name: "Mira Johansson",
    initial: "M",
    timeAgo: "6 days ago",
    text: "Been following Ean's work since his first upload. The growth from project to project is incredible. This one feels like a real breakthrough.",
    likes: 178,
    replies: [
      {
        id: "c9r1",
        name: "Callum Fraser",
        initial: "C",
        timeAgo: "5 days ago",
        text: "His earlier stuff was great but this is next level. You can feel the confidence in every cut.",
        likes: 38,
      },
    ],
  },
  {
    id: "c10",
    name: "Diego Fuentes",
    initial: "D",
    timeAgo: "1 day ago",
    text: "Watching this at 2am was a mistake because now I can't sleep. Not because it's scary, just because my brain won't stop thinking about it. 10/10.",
    likes: 95,
  },
];

function formatLikes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className={`flex gap-3 ${isReply ? "" : ""}`}>
      {/* Avatar */}
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-liam-black font-bold text-white ${
          isReply ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs"
        }`}
      >
        {comment.initial}
      </div>

      <div className="min-w-0 flex-1">
        {/* Name + time */}
        <div className="flex items-center gap-2">
          <span
            className="text-[13px] font-extrabold"
            style={comment.tier ? { color: TIER_HEX[comment.tier] } : undefined}
          >
            {comment.name}
          </span>
          <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
        </div>

        {/* Text */}
        <p className="mt-1 text-sm leading-relaxed">{comment.text}</p>

        {/* Actions */}
        <div className="mt-1.5 flex items-center gap-4">
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ThumbsUpIcon
              className={`h-3.5 w-3.5 ${liked ? "fill-foreground text-foreground" : ""}`}
            />
            <span className={liked ? "font-bold text-foreground" : ""}>
              {formatLikes(comment.likes + (liked ? 1 : 0))}
            </span>
          </button>
          <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            <ThumbsDownIcon className="h-3.5 w-3.5" />
          </button>
          <button className="text-xs font-bold text-muted-foreground transition-colors hover:text-foreground">
            Reply
          </button>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 flex flex-col gap-3 border-l-2 border-border pl-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentsSection() {
  const [sortBy, setSortBy] = useState<"top" | "newest">("top");
  const commentCount = COMMENTS.reduce(
    (acc, c) => acc + 1 + (c.replies?.length ?? 0),
    0
  );

  const sorted = [...COMMENTS].sort((a, b) =>
    sortBy === "top" ? b.likes - a.likes : 0
  );

  return (
    <section>
      {/* Header */}
      <div className="mb-5 flex items-center gap-4">
        <h3 className="text-lg font-extrabold">
          {commentCount} Comments
        </h3>
        <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
          <button
            onClick={() => setSortBy("top")}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
              sortBy === "top"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Top
          </button>
          <button
            onClick={() => setSortBy("newest")}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
              sortBy === "newest"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Newest
          </button>
        </div>
      </div>

      {/* Add comment input */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
          ?
        </div>
        <div className="flex-1 border-b-2 border-border pb-1 transition-colors focus-within:border-liam-black">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Comments list */}
      <div className="flex flex-col gap-5">
        {sorted.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </section>
  );
}
