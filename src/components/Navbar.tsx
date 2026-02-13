import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

interface NavbarProps {
  user?: { displayName: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

export function Navbar({ user, onLoginClick, onLogout }: NavbarProps) {
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

        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <Avatar className="h-8 w-8 border-2 border-liam-black">
                <AvatarFallback className="bg-liam-black text-xs font-bold text-white">
                  {user.displayName[0]}
                </AvatarFallback>
              </Avatar>
            </Link>
            <button
              onClick={onLogout}
              className="text-xs font-bold text-primary-foreground hover:opacity-80"
            >
              Log out
            </button>
          </div>
        ) : (
          <Button
            size="sm"
            className="bg-liam-black text-white hover:bg-liam-black/80"
            onClick={onLoginClick}
          >
            Log In
          </Button>
        )}
      </div>
    </nav>
  );
}
