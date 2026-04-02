
import { useCallback, useEffect, useState } from 'react';

import {
  deleteVote,
  getMovies,
  getUsers,
  getUserVoteForMovie,
  getWinner,
  insertMovie,
  upsertUser,
  upsertVote
} from '../database';
import type { MovieWithVotes, User } from '../types';

// ─── useMovies ────────────────────────────────────────────────────────────────

/**
 * Hook principal para la lista de películas.
 *
 * Recibe el userId del usuario actual para saber cuál es su voto
 * en cada película (userVote). El conteo de likes/dislikes es global
 * (suma de todos los usuarios).
 *
 * TODO: reemplazar userId hardcodeado por useAuth() cuando AuthContext esté listo.
 */
export function useMovies(userId: string) {
  const [movies, setMovies] = useState<MovieWithVotes[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const rows = await getMovies();

    // Para cada película, buscamos el voto del usuario actual
    const withUserVotes: MovieWithVotes[] = await Promise.all(
      rows.map(async (movie) => {
        const vote = await getUserVoteForMovie(userId, movie.id);
        return { ...movie, userVote: vote?.vote_type ?? null };
      }),
    );

    setMovies(withUserVotes);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  /**
   * Crea una nueva película localmente (synced=0).
   * El id se genera como `${userId}_${Date.now()}` para ser único
   * y trazable al usuario que la agregó.
   */
  const addMovie = useCallback(
    async (title: string, year: string) => {
      await insertMovie({
        id: `${userId}_${Date.now()}`,
        title: title.trim(),
        year: year.trim() || null,
        created_by_user_id: userId,
        created_at: Date.now(),
      });
      await refetch();
    },
    [userId, refetch],
  );

  /**
   * Registra o cambia el voto del usuario para una película.
   *
   * Comportamiento:
   * - Si el usuario no ha votado → inserta el voto.
   * - Si el usuario vota diferente → reemplaza (upsert por id determinístico).
   * - Si el usuario vota igual (toggle-off) → borra el voto.
   */
  const castVote = useCallback(
    async (movieId: string, voteType: 'like' | 'dislike') => {
      const voteId = `${userId}_${movieId}`;
      const existing = await getUserVoteForMovie(userId, movieId);

      if (existing?.vote_type === voteType) {
        // Toggle-off: el usuario hizo clic en su voto actual → lo borramos
        await deleteVote(voteId);
      } else {
        // Voto nuevo o cambio de voto
        await upsertVote({
          id: voteId,
          movie_id: movieId,
          user_id: userId,
          vote_type: voteType,
          created_at: Date.now(),
        });
      }

      await refetch();
    },
    [userId, refetch],
  );

  /**
   * Devuelve la película con más likes (ganadora de la votación).
   * En caso de empate gana la que fue agregada primero.
   */
  const fetchWinner = useCallback(() => getWinner(), []);

  return { movies, loading, refetch, addMovie, castVote, fetchWinner };
}

// ─── useUsers ────────────────────────────────────────────────────────────────

/**
 * Hook para la lista de usuarios de la sala.
 * Los usuarios llegan via syncService (PULL) y se persisten localmente.
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const rows = await getUsers();
    setUsers(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);


  const addUser = useCallback(
    async (name: string, avatar_color: string, id?: string) => {
      await upsertUser({
        id: id ?? `${Date.now()}`,
        name,
        avatar_color,
        created_at: Date.now(),
      });
    },
    [refetch],
  )

  return { users, loading, refetch, addUser };
}



