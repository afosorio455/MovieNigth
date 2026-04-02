import { getDb } from './client';
import type { Movie, MovieWithVotes } from '../types';

type MovieRow = Omit<MovieWithVotes, 'userVote'>;

/**
 * Inserta una nueva película con synced=0 (pendiente de subir al servidor).
 */
export async function insertMovie(
  movie: Omit<Movie, 'synced'>,
): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO movies (id, title, year, created_by_user_id, created_at, synced)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [movie.id, movie.title, movie.year ?? null, movie.created_by_user_id, movie.created_at],
  );
}

/**
 * Devuelve todas las películas con los conteos de likes y dislikes
 * agregados de todos los usuarios (JOIN con votes).
 * Ordenadas por fecha de creación ascendente.
 */
export async function getMovies(): Promise<MovieRow[]> {
  const db = getDb();
  return db.getAllAsync<MovieRow>(`
    SELECT
      m.id,
      m.title,
      m.year,
      m.created_by_user_id,
      m.created_at,
      m.synced,
      COALESCE(SUM(CASE WHEN v.vote_type = 'like'    THEN 1 ELSE 0 END), 0) AS likes,
      COALESCE(SUM(CASE WHEN v.vote_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
    FROM movies m
    LEFT JOIN votes v ON v.movie_id = m.id
    GROUP BY m.id
    ORDER BY m.created_at ASC
  `);
}

/**
 * Devuelve la película ganadora: la que tiene más likes.
 * En caso de empate, gana la que se agregó primero (created_at ASC).
 * Retorna null si no hay películas.
 */
export async function getWinner(): Promise<MovieRow | null> {
  const db = getDb();
  return db.getFirstAsync<MovieRow>(`
    SELECT
      m.id,
      m.title,
      m.year,
      m.created_by_user_id,
      m.created_at,
      m.synced,
      COALESCE(SUM(CASE WHEN v.vote_type = 'like'    THEN 1 ELSE 0 END), 0) AS likes,
      COALESCE(SUM(CASE WHEN v.vote_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
    FROM movies m
    LEFT JOIN votes v ON v.movie_id = m.id
    GROUP BY m.id
    ORDER BY likes DESC, m.created_at ASC
    LIMIT 1
  `);
}

/**
 * Devuelve todas las películas que aún no se han sincronizado con el servidor.
 * Usado por syncService en el ciclo de PUSH.
 */
export async function getPendingMovies(): Promise<Movie[]> {
  const db = getDb();
  return db.getAllAsync<Movie>(`SELECT * FROM movies WHERE synced = 0`);
}

/**
 * Marca un conjunto de películas como sincronizadas (synced=1).
 * Llamado por syncService tras un PUSH exitoso.
 */
export async function markMoviesSynced(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const db = getDb();
  const placeholders = ids.map(() => '?').join(', ');
  await db.runAsync(
    `UPDATE movies SET synced = 1 WHERE id IN (${placeholders})`,
    ids,
  );
}
