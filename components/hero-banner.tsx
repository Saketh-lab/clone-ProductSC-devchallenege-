import Image from "next/image";
import { Info, Play } from "lucide-react";
import type { TmdbMovie } from "@/lib/tmdb";
import { TMDB_IMAGE } from "@/lib/tmdb";

type HeroBannerProps = {
  movie: TmdbMovie;
};

export function HeroBanner({ movie }: HeroBannerProps) {
  const backdrop = TMDB_IMAGE.backdrop(movie.backdrop_path);
  const year = movie.release_date?.slice(0, 4);

  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden sm:min-h-[78vh]">
      {backdrop ? (
        <Image
          src={backdrop}
          alt=""
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-900" />
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20"
      />

      <div className="relative z-10 flex min-h-[70vh] max-w-2xl flex-col justify-end px-4 pb-16 pt-28 sm:min-h-[78vh] sm:px-8 sm:pb-20 md:px-12">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-white/90 sm:text-sm">
          <span className="rounded bg-[#E50914] px-1.5 py-0.5 text-[10px] font-bold leading-none sm:text-xs">
            N
          </span>
          <span className="uppercase tracking-[0.2em] text-white/70">
            Movie
          </span>
        </div>

        <h1 className="text-balance text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
          {movie.title}
        </h1>

        {year ? (
          <p className="mt-2 text-sm text-white/70 sm:text-base">{year}</p>
        ) : null}

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
          {movie.overview}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded bg-white px-6 text-base font-semibold text-black transition hover:bg-white/85"
          >
            <Play className="size-5 fill-current" />
            Play
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded bg-white/30 px-6 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <Info className="size-5" />
            More Info
          </button>
        </div>
      </div>
    </section>
  );
}
