import type { User as AuthUser } from '../types/auth.types';
import type { User } from '../types';
import { getDb } from './client';

// ─── Authenticated user repository (tabla `user`) ───────────────────────────

interface AuthUserRow {
  id: string;
  email: string;
  name: string;
  avatar_color: string;
  avatar_url: string | null;
  is_local: number;
  created_at: string | null;
}

/**
 * Repositorio para el usuario autenticado.
 * Persiste el perfil en la tabla `user` (singular).
 * Los tokens JWT viven en SecureStore; los usuarios locales usan un token UUID.
 */
export const userRepository = {
  /**
   * Guarda o actualiza el usuario autenticado (viene del servidor, is_local=0).
   */
  async save(user: AuthUser): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `INSERT INTO user (id, email, name, avatar_color, avatar_url, is_local, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?)
       ON CONFLICT(id) DO UPDATE SET
         email        = excluded.email,
         name         = excluded.name,
         avatar_color = excluded.avatar_color,
         avatar_url   = excluded.avatar_url,
         is_local     = 0,
         updated_at   = CURRENT_TIMESTAMP`,
      [user.id, user.email, user.name, user.avatarColor, user.avatarUrl ?? null, user.createdAt ?? null],
    );
  },

  /**
   * Guarda un usuario creado localmente (sin conexión, is_local=1).
   * Queda pendiente de sincronizar cuando vuelva la red.
   */
  async saveLocal(user: AuthUser): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `INSERT INTO user (id, email, name, avatar_color, avatar_url, is_local, created_at)
       VALUES (?, ?, ?, ?, ?, 1, ?)
       ON CONFLICT(id) DO UPDATE SET
         name         = excluded.name,
         avatar_color = excluded.avatar_color,
         avatar_url   = excluded.avatar_url,
         updated_at   = CURRENT_TIMESTAMP`,
      [user.id, user.email, user.name, user.avatarColor, user.avatarUrl ?? null, user.createdAt ?? null],
    );
  },

  /**
   * Busca un usuario por email. Usado en el login offline.
   */
  async findByEmail(email: string): Promise<AuthUser | null> {
    const db = getDb();
    const row = await db.getFirstAsync<AuthUserRow>(
      'SELECT id, email, name, avatar_color, avatar_url, is_local, created_at FROM user WHERE email = ? LIMIT 1',
      [email],
    );
    if (!row) return null;
    return mapRow(row);
  },

  /**
   * Devuelve el usuario más reciente (usado en initialize()).
   */
  async getCurrent(): Promise<AuthUser | null> {
    const db = getDb();
    const row = await db.getFirstAsync<AuthUserRow>(
      'SELECT id, email, name, avatar_color, avatar_url, is_local, created_at FROM user ORDER BY updated_at DESC LIMIT 1',
    );
    if (!row) return null;
    return mapRow(row);
  },

  /**
   * Devuelve todos los usuarios locales pendientes de sincronizar.
   */
  async getPendingSync(): Promise<AuthUser[]> {
    const db = getDb();
    const rows = await db.getAllAsync<AuthUserRow>(
      'SELECT id, email, name, avatar_color, avatar_url, is_local, created_at FROM user WHERE is_local = 1',
    );
    return rows.map(mapRow);
  },

  /**
   * Marca el usuario como sincronizado con el servidor.
   */
  async markSynced(id: string): Promise<void> {
    const db = getDb();
    await db.runAsync('UPDATE user SET is_local = 0 WHERE id = ?', [id]);
  },

  async clear(): Promise<void> {
    const db = getDb();
    await db.runAsync('DELETE FROM user');
  },
};

function mapRow(row: AuthUserRow): AuthUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarColor: row.avatar_color,
    avatarUrl: row.avatar_url ?? undefined,
    createdAt: row.created_at ?? undefined,
  };
}

// ─── Group members (tabla `users`) ──────────────────────────────────────────

interface UserRow {
  id: string;
  name: string;
  avatar_color: string;
  created_at: number;
}

export async function upsertUser(user: {
  id: string;
  name: string;
  avatar_color: string;
  created_at: number;
}): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO users (id, name, avatar_color, created_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name         = excluded.name,
       avatar_color = excluded.avatar_color`,
    [user.id, user.name, user.avatar_color, user.created_at],
  );
}

export async function getUsers(): Promise<User[]> {
  const db = getDb();
  const rows = await db.getAllAsync<UserRow>(
    'SELECT id, name, avatar_color, created_at FROM users ORDER BY created_at ASC',
  );
  return rows;
}
