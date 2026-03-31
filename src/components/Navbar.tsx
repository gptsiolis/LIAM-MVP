"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MenuIcon, XIcon, SearchIcon } from "lucide-react";

interface NavbarProps {
  user?: { displayName: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

export function Navbar({ user, onLoginClick, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-primary">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo + slogan */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-primary-foreground"
          >
            LIAM
          </Link>
          <span className="hidden text-[11px] font-bold uppercase tracking-widest text-primary-foreground sm:inline">
            The streaming service of the AI era
          </span>
        </div>

        {/* Search bar */}
        <div className="hidden flex-1 justify-center px-6 sm:flex md:px-12">
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-liam-black" />
            <input
              type="text"
              placeholder="Search films, creators..."
              className="h-9 w-full rounded-none border-4 border-black bg-white pl-9 pr-3 text-sm font-bold text-black placeholder:font-bold placeholder:text-black/50 focus:border-black focus:outline-none"
            />
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/"
            className="text-sm font-bold text-primary-foreground transition-opacity hover:opacity-80"
          >
            Explore
          </Link>
          <Link
            href="/profile"
            className="text-sm font-bold text-primary-foreground transition-opacity hover:opacity-80"
          >
            Collection
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <Avatar className="h-8 w-8 border-2 border-liam-black transition-transform hover:scale-105">
                  <AvatarFallback className="bg-liam-black text-xs font-bold text-white">
                    {user.displayName[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <button
                onClick={onLogout}
                className="text-xs font-bold text-primary-foreground transition-opacity hover:opacity-80"
              >
                Log out
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              className="bg-liam-black text-white transition-opacity hover:bg-liam-black/80"
              onClick={onLoginClick}
            >
              Log In
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="flex flex-col gap-3 border-t border-primary-foreground/10 px-4 pb-4 sm:hidden">
          <Link
            href="/"
            className="text-sm font-bold text-primary-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Explore
          </Link>
          <Link
            href="/profile"
            className="text-sm font-bold text-primary-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Collection
          </Link>
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 border-2 border-liam-black">
                  <AvatarFallback className="bg-liam-black text-xs font-bold text-white">
                    {user.displayName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold text-primary-foreground">
                  {user.displayName}
                </span>
              </div>
              <button
                onClick={() => { onLogout?.(); setMobileOpen(false); }}
                className="text-xs font-bold text-primary-foreground hover:opacity-80"
              >
                Log out
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full bg-liam-black text-white hover:bg-liam-black/80"
              onClick={() => { onLoginClick?.(); setMobileOpen(false); }}
            >
              Log In
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
