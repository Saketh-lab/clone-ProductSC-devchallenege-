"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Search, X } from "lucide-react";
import type { TmdbMovie } from "@/lib/tmdb";
import { Input } from "@/components/ui/input";
import { HomeSidebar } from "@/components/home-sidebar";
import { HeroBanner } from "@/components/hero-banner";
import { MovieRow } from "@/components/movie-row";
import { MovieCard } from "@/components/movie-card";
import { MovieDetailFlow } from "@/components/movie-detail-flow";

export type HomeRows = {
  popular: TmdbMovie[];
  action: TmdbMovie[];
  comedy: TmdbMovie[];
  documentary: TmdbMovie[];
  horror: TmdbMovie[];
};

type HomeBrowseProps = {
  rows: HomeRows;
  featured: TmdbMovie;
};

function dedupeMovies(movies: TmdbMovie[]) {
  const seen = new Set<number>();
  return movies.filter((movie) => {
    if (seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });
}

function HomeBrowseInner({ rows, featured }: HomeBrowseProps) {
  const searchParams = useSearchParams();
  const profileName = searchParams.get("profile");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<TmdbMovie | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allMovies = useMemo(
    () =>
      dedupeMovies([
        ...rows.popular,
        ...rows.action,
        ...rows.comedy,
        ...rows.documentary,
        ...rows.horror,
      ]),
    [rows]
  );

  const trimmed = query.trim();
  const isSearching = trimmed.length > 0;

  const results = useMemo(() => {
    if (!isSearching) return [];
    const q = trimmed.toLowerCase();
    return allMovies.filter((movie) => movie.title.toLowerCase().includes(q));
  }, [allMovies, isSearching, trimmed]);

  function openSearch() {
    setSearchOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function handleMovieClick(movie: TmdbMovie) {
    setSelectedMovie(movie);
  }

  return (
    <div className="min-h-dvh bg-black text-white">
      <HomeSidebar
        searchActive={searchOpen || isSearching}
        onSearchClick={openSearch}
        profileName={profileName}
      />

      <div className="pl-14 sm:pl-16">
        {searchOpen || isSearching ? (
          <div className="sticky top-0 z-20 border-b border-white/10 bg-black/95 px-4 py-3 backdrop-blur-sm sm:px-8 md:px-12">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="shrink-0 text-white/80 transition hover:text-white"
              >
                <ArrowLeft className="size-6" />
              </button>

              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
                <Input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search titles"
                  autoComplete="off"
                  className="h-11 rounded-md border border-white/15 bg-neutral-800 pl-10 pr-10 text-base text-white placeholder:text-white/45 focus-visible:border-white/40 focus-visible:ring-white/20 md:text-base"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {isSearching ? (
          <section className="px-4 py-6 sm:px-8 md:px-12">
            <h2 className="mb-5 text-xl font-bold sm:text-2xl">
              Search Results for &ldquo;{trimmed}&rdquo;
            </h2>

            {results.length === 0 ? (
              <p className="text-white/60">No results found.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
                {results
                  .filter((movie) => movie.poster_path)
                  .map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={handleMovieClick}
                    />
                  ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <HeroBanner movie={featured} />

            <div className="space-y-8 pb-16 sm:space-y-10">
              <MovieRow
                title="Trending Now"
                movies={rows.popular}
                overlapHero
                onMovieClick={handleMovieClick}
              />
              <MovieRow
                title="Action"
                movies={rows.action}
                onMovieClick={handleMovieClick}
              />
              <MovieRow
                title="Comedy"
                movies={rows.comedy}
                onMovieClick={handleMovieClick}
              />
              <MovieRow
                title="Documentaries"
                movies={rows.documentary}
                onMovieClick={handleMovieClick}
              />
              <MovieRow
                title="Horror"
                movies={rows.horror}
                onMovieClick={handleMovieClick}
              />
            </div>
          </>
        )}
      </div>

      <MovieDetailFlow
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

export function HomeBrowse(props: HomeBrowseProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-black text-white">
          <p className="text-sm text-white/60">Loading…</p>
        </div>
      }
    >
      <HomeBrowseInner {...props} />
    </Suspense>
  );
}
