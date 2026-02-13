import { Navbar } from "@/components/Navbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PayBanner } from "@/components/PayBanner";
import { MintedCardsFeed } from "@/components/MintedCardsFeed";

// Fake video data — will come from DB in later steps
const DEMO_VIDEO = {
  title: "The Crossing — A Short Film",
  creatorName: "Ava Chen",
  embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        {/* Hero: Video + Pay Banner — figure-dominant layout */}
        <section className="flex flex-col gap-6 lg:flex-row">
          {/* Video (9-col equivalent) */}
          <div className="w-full lg:w-3/4">
            <VideoPlayer
              title={DEMO_VIDEO.title}
              embedUrl={DEMO_VIDEO.embedUrl}
            />
            {/* Creator info under video */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-liam-black text-xs font-bold text-white">
                A
              </div>
              <div>
                <p className="text-sm font-bold">{DEMO_VIDEO.creatorName}</p>
                <p className="text-xs text-muted-foreground">Director &middot; 12 supporters</p>
              </div>
            </div>
          </div>

          {/* Pay Banner (3-col sidebar) */}
          <div className="w-full lg:w-1/4">
            <PayBanner
              videoTitle={DEMO_VIDEO.title}
              creatorName={DEMO_VIDEO.creatorName}
            />
          </div>
        </section>

        {/* Minted Cards Feed */}
        <section className="mt-10">
          <MintedCardsFeed />
        </section>
      </main>
    </div>
  );
}
