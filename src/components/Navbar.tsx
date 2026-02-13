import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-primary px-6 py-3">
      {/* Logo */}
      <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary-foreground">
        LIAM
      </Link>

      {/* Nav links + auth */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="hidden text-sm font-bold text-primary-foreground hover:opacity-80 sm:block"
        >
          Explore
        </Link>
        <Link
          href="/profile"
          className="hidden text-sm font-bold text-primary-foreground hover:opacity-80 sm:block"
        >
          Collection
        </Link>
        <Button
          size="sm"
          className="bg-liam-black text-white hover:bg-liam-black/80"
        >
          Log In
        </Button>
      </div>
    </nav>
  );
}
