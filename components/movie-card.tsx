import Image from "next/image";
import type { TmdbMovie } from "@/lib/tmdb";
import { TMDB_IMAGE } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

type MovieCardProps = {
  movie: TmdbMovie;
  className?: string;
  onClick?: (movie: TmdbMovie) => void;
};

export function MovieCard({ movie, className, onClick }: MovieCardProps) {
  const poster = TMDB_IMAGE.poster(movie.poster_path);
  if (!poster) return null;

  return (
    <article
      className={cn(
        "group relative w-full cursor-pointer",
        className
      )}
      onClick={onClick ? () => onClick(movie) : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(movie);
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-neutral-800 transition duration-200 group-hover:z-10 group-hover:scale-105 group-hover:shadow-xl">
        <Image
          src={poster}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 20vw, 160px"
        />
        <span
          aria-hidden
          className="absolute left-1.5 top-1.5 rounded-[2px] bg-[#E50914] px-1 py-0.5 text-[9px] font-bold leading-none text-white"
        >
          N
        </span>
      </div>
      <p className="mt-1.5 truncate text-xs text-white/70 sm:text-sm">
        {movie.title}
      </p>
    </article>
  );
}
