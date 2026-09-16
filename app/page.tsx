"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetflixLogo } from "@/components/netflix-logo";

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleGetStarted(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    router.push(
      trimmed ? `/login?email=${encodeURIComponent(trimmed)}` : "/login"
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      {/* Poster-wall atmosphere (placeholder for real collage asset) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(105deg, rgba(0,0,0,0.55) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 40%, transparent 0%, rgba(0,0,0,0.75) 70%, #000 100%),
            repeating-linear-gradient(
              -12deg,
              #1a1a1a 0px,
              #1a1a1a 90px,
              #111 90px,
              #111 180px,
              #222 180px,
              #222 270px,
              #0d0d0d 270px,
              #0d0d0d 360px
            )
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black"
      />

      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8 md:px-12">
          <NetflixLogo />

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded border border-white/40 bg-black/60 px-2.5 text-sm text-white sm:h-9 sm:px-3"
              aria-label="Select language"
            >
              <Globe className="size-3.5 shrink-0 opacity-90" />
              <span className="hidden sm:inline">English</span>
              <ChevronDown className="size-3.5 opacity-80" />
            </button>

            <Button
              asChild
              className="h-8 rounded bg-[#E50914] px-3.5 text-sm font-medium text-white hover:bg-[#c11119] sm:h-9 sm:px-4"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 sm:gap-5">
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Unlimited movies, TV shows, and more
          </h1>

          <p className="text-lg text-white sm:text-xl md:text-2xl">
            Starts at $6.99. Cancel anytime.
          </p>

          <p className="max-w-xl text-base text-white sm:text-lg">
            Ready to watch? Enter your email to create or restart your
            membership.
          </p>

          <form
            onSubmit={handleGetStarted}
            className="mt-2 flex w-full max-w-xl flex-col gap-3 sm:mt-4 sm:flex-row sm:items-stretch sm:gap-2"
          >
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className="h-12 flex-1 rounded border border-white/50 bg-black/60 px-4 text-base text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30 sm:h-14 md:text-base"
            />
            <Button
              type="submit"
              className="h-12 shrink-0 rounded bg-[#E50914] px-5 text-lg font-medium text-white hover:bg-[#c11119] sm:h-14 sm:px-6 sm:text-xl"
            >
              Get Started <span aria-hidden>›</span>
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
