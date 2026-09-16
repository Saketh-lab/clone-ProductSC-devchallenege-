import type { TmdbMovie } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";

type MovieRowProps = {
  title: string;
  movies: TmdbMovie[];
  onMovieClick?: (movie: TmdbMovie) => void;
  /** Pull row up over the hero (only for the first row under the banner) */
  overlapHero?: boolean;
};

export function MovieRow({
  title,
  movies,
  onMovieClick,
  overlapHero = false,
}: MovieRowProps) {
  const withPosters = movies.filter((m) => m.poster_path);

  if (withPosters.length === 0) return null;

  return (
    <section
      className={
        overlapHero
          ? "relative z-10 -mt-8 space-y-3 px-4 sm:-mt-12 sm:px-8 md:px-12"
          : "relative z-10 space-y-3 px-4 sm:px-8 md:px-12"
      }
    >
      <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>

      <div className="flex gap-2 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden">
        {withPosters.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
            className="w-[110px] shrink-0 sm:w-[140px] md:w-[160px]"
          />
        ))}
      </div>
    </section>
  );
}
