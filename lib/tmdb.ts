export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

type TmdbListResponse = {
  results: TmdbMovie[];
};

function getApiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("Missing TMDB_API_KEY. Add it to .env.local.");
  }
  return key;
}

async function fetchTmdbList(url: string): Promise<TmdbMovie[]> {
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`TMDB request failed (${res.status})`);
  }

  const data = (await res.json()) as TmdbListResponse;
  return data.results ?? [];
}

export async function getPopularMovies(): Promise<TmdbMovie[]> {
  const apiKey = getApiKey();
  return fetchTmdbList(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
  );
}

export async function getMoviesByGenre(genreId: number): Promise<TmdbMovie[]> {
  const apiKey = getApiKey();
  return fetchTmdbList(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`
  );
}

export const TMDB_IMAGE = {
  poster: (path: string | null) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : null,
  backdrop: (path: string | null) =>
    path ? `https://image.tmdb.org/t/p/original${path}` : null,
} as const;

export const GENRES = {
  action: 28,
  comedy: 35,
  documentary: 99,
  horror: 27,
} as const;
