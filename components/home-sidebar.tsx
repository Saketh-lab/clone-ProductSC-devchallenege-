"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Clapperboard,
  Home,
  Monitor,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  active: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, href: "/home", active: true },
  { label: "New & Popular", icon: CalendarDays, href: "#", active: false },
  { label: "TV Shows", icon: Monitor, href: "#", active: false },
  { label: "Movies", icon: Clapperboard, href: "#", active: false },
  { label: "My List", icon: Plus, href: "#", active: false },
];


const PROFILE_STYLES: Record<string, { initial: string; color: string }> = {
  Alex: { initial: "A", color: "bg-[#E50914]" },
  Sam: { initial: "S", color: "bg-[#0071EB]" },
  Jordan: { initial: "J", color: "bg-[#46D369]" },
  Kids: { initial: "K", color: "bg-[#808080]" },
};

type HomeSidebarProps = {
  searchActive?: boolean;
  onSearchClick?: () => void;
  profileName?: string | null;
};

export function HomeSidebar({
  searchActive = false,
  onSearchClick,
  profileName,
}: HomeSidebarProps) {
  const profile =
    (profileName && PROFILE_STYLES[profileName]) || PROFILE_STYLES.Alex;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-14 flex-col items-center gap-6 bg-black/80 py-8 backdrop-blur-sm sm:w-16">
      <Link
        href="/profiles"
        aria-label="Switch profile"
        title={profileName ?? "Alex"}
        className={cn(
          "flex size-8 items-center justify-center rounded-full text-sm font-semibold text-white transition hover:ring-2 hover:ring-white sm:size-9",
          profile.color
        )}
      >
        {profile.initial}
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-5">
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search"
          aria-pressed={searchActive}
          className={cn(
            "relative flex flex-col items-center gap-1 text-white/70 transition-colors hover:text-white",
            searchActive && "text-white"
          )}
        >
          <Search className="size-5 sm:size-6" strokeWidth={1.75} />
          {searchActive ? (
            <span
              aria-hidden
              className="absolute -bottom-2 h-0.5 w-5 rounded-full bg-[#E50914]"
            />
          ) : null}
        </button>

        {NAV_ITEMS.map(({ label, icon: Icon, href, active }) => (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className={cn(
              "relative flex flex-col items-center gap-1 text-white/70 transition-colors hover:text-white",
              active && !searchActive && "text-white"
            )}
          >
            <Icon className="size-5 sm:size-6" strokeWidth={1.75} />
            {active && !searchActive ? (
              <span
                aria-hidden
                className="absolute -bottom-2 h-0.5 w-5 rounded-full bg-[#E50914]"
              />
            ) : null}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
