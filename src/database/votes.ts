import { getDb } from './client';
import type { Vote } from '../types';

/**
 * Inserta o reemplaza el voto de un usuario para una película.
 *
 * El id del voto es DETERMINÍSTICO: `${userId}_${movieId}`.
 * Esto garantiza que siempre haya un solo voto por (usuario, película),
 * y que INSERT OR REPLACE funcione como "cambiar el voto" sin duplicados.
 *
 * Si el usuario ya votó 'like' y vuelve a votar 'like', el llamador
 * debe usar deleteVote para quitar el voto (toggle-off).
 */
export async function upsertVote(vote: Omit<Vote, 'synced'>): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO votes (id, movie_id, user_id, vote_type, created_at, synced)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [vote.id, vote.movie_id, vote.user_id, vote.vote_type, vote.created_at],
  );
}

/**
 * Elimina el voto de un usuario para una película (toggle-off).
 * El id debe ser el mismo determinístico: `${userId}_${movieId}`.
 */
export async function deleteVote(voteId: string): Promise<void> {
  const db = getDb();
  await db.runAsync(`DELETE FROM votes WHERE id = ?`, [voteId]);
}

/**
 * Devuelve el voto actual de un usuario para una película específica,
 * o null si todavía no ha votado.
 */
export async function getUserVoteForMovie(
  userId: string,
  movieId: string,
): Promise<Vote | null> {
  const db = getDb();
  return db.getFirstAsync<Vote>(
    `SELECT * FROM votes WHERE user_id = ? AND movie_id = ?`,
    [userId, movieId],
  );
}

/**
 * Devuelve todos los votos pendientes de sincronizar (synced=0).
 * Usado por syncService en el ciclo de PUSH.
 */
export async function getPendingVotes(): Promise<Vote[]> {
  const db = getDb();
  return db.getAllAsync<Vote>(`SELECT * FROM votes WHERE synced = 0`);
}

/**
 * Marca un conjunto de votos como sincronizados (synced=1).
 * Llamado por syncService tras un PUSH exitoso.
 */
export async function markVotesSynced(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const db = getDb();
  const placeholders = ids.map(() => '?').join(', ');
  await db.runAsync(
    `UPDATE votes SET synced = 1 WHERE id IN (${placeholders})`,
    ids,
  );
}

// ─── Sync metadata ────────────────────────────────────────────────────────────

/**
 * Devuelve el timestamp (ms) del último sync exitoso.
 * El servidor usa este valor en GET /api/sync?lastSync=<ts> para
 * devolver solo los registros creados/modificados después de esa fecha.
 */
export async function getLastSyncTimestamp(): Promise<number> {
  const db = getDb();
  const row = await db.getFirstAsync<{ last_sync_timestamp: number }>(
    `SELECT last_sync_timestamp FROM sync_metadata WHERE id = 'main'`,
  );
  return row?.last_sync_timestamp ?? 0;
}

/**
 * Actualiza el timestamp del último sync exitoso.
 * Llamado por syncService al finalizar el ciclo de PULL.
 */
export async function setLastSyncTimestamp(ts: number): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `UPDATE sync_metadata SET last_sync_timestamp = ? WHERE id = 'main'`,
    [ts],
  );
}
