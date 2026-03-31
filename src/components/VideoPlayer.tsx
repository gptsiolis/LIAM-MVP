interface VideoPlayerProps {
  title: string;
  embedUrl: string;
}

export function VideoPlayer({ title, embedUrl }: VideoPlayerProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-liam-black">
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
