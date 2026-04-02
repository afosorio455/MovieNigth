import { getDb } from './client';

type SessionRow = {
  user_id: string;
  user_name: string;
  user_color: string;
};

export async function getSession(): Promise<SessionRow | null> {
  const db = getDb();
  const row = await db.getFirstAsync<SessionRow>(
    `SELECT user_id, user_name, user_color FROM session WHERE id = 'current'`,
  );
  return row ?? null;
}

export async function setSession(userId: string, userName: string, userColor: string): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO session (id, user_id, user_name, user_color) VALUES ('current', ?, ?, ?)`,
    userId,
    userName,
    userColor,
  );
}

export async function clearSession(): Promise<void> {
  const db = getDb();
  await db.runAsync(`DELETE FROM session WHERE id = 'current'`);
}
