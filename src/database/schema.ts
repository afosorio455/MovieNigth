import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Crea todas las tablas si no existen.
 * Se llama una sola vez al arrancar la app (desde initDatabase en index.ts).
 *
 * WAL mode mejora la performance de escritura concurrente.
 *
 * Tablas:
 *   user          — perfil del usuario autenticado (tokens en SecureStore)
 *   users         — participantes de la sala (poblados vía sync pull)
 *   movies        — películas añadidas por los usuarios del grupo
 *   votes         — votos like/dislike; id determinístico por (user_id, movie_id)
 *   sync_metadata — un solo registro con el timestamp del último sync exitoso
 *   session       — sesión activa (legacy, se mantiene por compatibilidad)
 */
export async function initializeSchema(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS user (
      id           TEXT PRIMARY KEY,
      email        TEXT NOT NULL,
      name         TEXT NOT NULL,
      avatar_color TEXT NOT NULL DEFAULT '#6366F1',
      avatar_url   TEXT,
      is_local     INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      avatar_color TEXT NOT NULL,
      created_at   INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS movies (
      id                 TEXT PRIMARY KEY,
      title              TEXT NOT NULL,
      year               TEXT,
      created_by_user_id TEXT NOT NULL,
      created_at         INTEGER NOT NULL,
      synced             INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS votes (
      id         TEXT PRIMARY KEY,
      movie_id   TEXT NOT NULL,
      user_id    TEXT NOT NULL,
      vote_type  TEXT NOT NULL CHECK(vote_type IN ('like', 'dislike')),
      created_at INTEGER NOT NULL,
      synced     INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (movie_id) REFERENCES movies(id)
    );

    CREATE TABLE IF NOT EXISTS sync_metadata (
      id                   TEXT PRIMARY KEY,
      last_sync_timestamp  INTEGER NOT NULL DEFAULT 0
    );

    INSERT OR IGNORE INTO sync_metadata (id, last_sync_timestamp) VALUES ('main', 0);

    CREATE TABLE IF NOT EXISTS session (
      id           TEXT PRIMARY KEY DEFAULT 'current',
      user_id      TEXT NOT NULL,
      user_name    TEXT NOT NULL,
      user_color   TEXT NOT NULL
    );
  `);
}
