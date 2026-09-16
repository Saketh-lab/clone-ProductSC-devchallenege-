"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Info, Pause, Play, X } from "lucide-react";
import type { TmdbMovie } from "@/lib/tmdb";
import { TMDB_IMAGE } from "@/lib/tmdb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type MovieDetailFlowProps = {
  movie: TmdbMovie | null;
  onClose: () => void;
};

const FAKE_DURATION_SECONDS = 2 * 60 * 60; // 2:00:00

function formatTime(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MovieDetailFlow({ movie, onClose }: MovieDetailFlowProps) {
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset local state whenever a different movie is selected / cleared
  useEffect(() => {
    setShowFullInfo(false);
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  }, [movie?.id]);

  // Fake progress: +1% per second while playing and not paused
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const id = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(id);
          return 100;
        }
        return prev + 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [isPlaying, isPaused]);

  function exitEverything() {
    setShowFullInfo(false);
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    onClose();
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) exitEverything();
  }

  if (!movie) return null;

  const backdrop =
    TMDB_IMAGE.backdrop(movie.backdrop_path) ??
    TMDB_IMAGE.poster(movie.poster_path);
  const year = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average?.toFixed(1);
  const currentSeconds = (progress / 100) * FAKE_DURATION_SECONDS;

  // State 3 — full-screen player (replaces modal)
  if (isPlaying) {
    return (
      <div className="fixed inset-0 z-[60] bg-black text-white">
        {backdrop ? (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
        ) : null}
        <div aria-hidden className="absolute inset-0 bg-black/55" />

        <button
          type="button"
          onClick={exitEverything}
          aria-label="Exit player"
          className="absolute left-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/80 sm:left-6 sm:top-6"
        >
          <X className="size-6" />
        </button>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Play" : "Pause"}
            className="flex size-20 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 sm:size-24"
          >
            {isPaused ? (
              <Play className="size-10 fill-current sm:size-12" />
            ) : (
              <Pause className="size-10 fill-current sm:size-12" />
            )}
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent px-4 pb-6 pt-16 sm:px-8 sm:pb-8">
          <div className="mx-auto w-full max-w-4xl space-y-3">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-lg font-semibold sm:text-xl">{movie.title}</h2>
              <p className="shrink-0 font-mono text-sm text-white/70">
                {formatTime(currentSeconds)} / {formatTime(FAKE_DURATION_SECONDS)}
              </p>
            </div>
            <div
              className="h-1 w-full overflow-hidden rounded-full bg-white/25"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[#E50914] transition-[width] duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // States 1 & 2 — compact / expanded Dialog
  return (
    <Dialog open={!!movie} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] w-full max-w-2xl gap-0 overflow-y-auto rounded-lg border-0 bg-neutral-900 p-0 text-white shadow-2xl ring-0 sm:max-w-2xl"
      >
        <DialogTitle className="sr-only">{movie.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {showFullInfo
            ? `Details for ${movie.title}`
            : `Preview for ${movie.title}`}
        </DialogDescription>

        <div className="relative aspect-video w-full overflow-hidden bg-neutral-800">
          {backdrop ? (
            <Image
              src={backdrop}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          ) : null}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"
          />

          <button
            type="button"
            onClick={exitEverything}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 rounded-full bg-neutral-900/80 p-1.5 text-white transition hover:bg-neutral-800"
          >
            <X className="size-5" />
          </button>

          <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide">
              <span className="rounded bg-[#E50914] px-1.5 py-0.5 text-[10px] font-bold leading-none">
                N
              </span>
              <span className="uppercase tracking-[0.2em] text-white/70">
                Movie
              </span>
            </div>
            <h2 className="text-2xl font-bold drop-shadow-md sm:text-3xl">
              {movie.title}
            </h2>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          {showFullInfo ? (
            <button
              type="button"
              onClick={() => setShowFullInfo(false)}
              aria-label="Back to preview"
              className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setIsPlaying(true);
                setIsPaused(false);
              }}
              className="inline-flex h-11 items-center gap-2 rounded bg-[#E50914] px-6 text-base font-semibold text-white transition hover:bg-[#c11119]"
            >
              <Play className="size-5 fill-current" />
              Play
            </button>
            <button
              type="button"
              onClick={() => setShowFullInfo(true)}
              className="inline-flex h-11 items-center gap-2 rounded bg-white/20 px-6 text-base font-semibold text-white transition hover:bg-white/30"
            >
              <Info className="size-5" />
              More Info
            </button>
          </div>

          {showFullInfo ? (
            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                {year ? <span>{year}</span> : null}
                {year && rating ? (
                  <span aria-hidden className="text-white/30">
                    •
                  </span>
                ) : null}
                {rating ? (
                  <span className="rounded border border-white/30 px-1.5 py-0.5 text-xs">
                    {rating} Rating
                  </span>
                ) : null}
              </div>
              <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                {movie.overview || "No overview available."}
              </p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
