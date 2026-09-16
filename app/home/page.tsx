import {
  GENRES,
  getMoviesByGenre,
  getPopularMovies,
  type TmdbMovie,
} from "@/lib/tmdb";
import { HomeBrowse } from "@/components/home-browse";

export const dynamic = "force-dynamic";

type HomeContent = {
  popular: TmdbMovie[];
  action: TmdbMovie[];
  comedy: TmdbMovie[];
  documentary: TmdbMovie[];
  horror: TmdbMovie[];
};

async function loadHomeContent(): Promise<HomeContent> {
  const [popular, action, comedy, documentary, horror] = await Promise.all([
    getPopularMovies(),
    getMoviesByGenre(GENRES.action),
    getMoviesByGenre(GENRES.comedy),
    getMoviesByGenre(GENRES.documentary),
    getMoviesByGenre(GENRES.horror),
  ]);

  return { popular, action, comedy, documentary, horror };
}

export default async function HomePage() {
  let content: HomeContent | null = null;
  let errorMessage: string | null = null;

  try {
    content = await loadHomeContent();
  } catch (err) {
    errorMessage =
      err instanceof Error ? err.message : "Failed to load movies from TMDB.";
  }

  if (errorMessage || !content) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-black px-4 text-center text-white">
        <h1 className="text-2xl font-semibold">Couldn&apos;t load home</h1>
        <p className="max-w-md text-sm text-white/60">{errorMessage}</p>
      </div>
    );
  }

  const featured =
    content.popular.find((m) => m.backdrop_path) ?? content.popular[0];

  if (!featured) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black text-white">
        <p>No movies available right now.</p>
      </div>
    );
  }

  return <HomeBrowse rows={content} featured={featured} />;
}
