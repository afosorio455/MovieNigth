import { openDatabase } from './client';
import { initializeSchema } from './schema';

// Exporta todo lo que el resto de la app necesita importar
export { getDb } from './client';
export { insertMovie, getMovies, getWinner, getPendingMovies, markMoviesSynced } from './movies';
export { upsertUser, getUsers } from './users';
export { getSession, setSession, clearSession } from './session';
export {
  upsertVote,
  deleteVote,
  getUserVoteForMovie,
  getPendingVotes,
  markVotesSynced,
  getLastSyncTimestamp,
  setLastSyncTimestamp,
} from './votes';

/**
 * Inicializa la base de datos: abre la conexión y crea las tablas.
 * Debe llamarse UNA SOLA VEZ al arrancar la app, en el root layout,
 * antes de que cualquier pantalla intente leer o escribir datos.
 *
 * Es idempotente: llamarla más de una vez no hace daño
 * (CREATE TABLE IF NOT EXISTS).
 */
export async function initDatabase(): Promise<void> {
  const db = await openDatabase();
  await initializeSchema(db);
}
