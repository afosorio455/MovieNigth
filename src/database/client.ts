import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

/**
 * Abre la conexión a la BD SQLite una sola vez (patrón singleton).
 * Las funciones de CRUD la llaman directamente; si ya está abierta
 * devuelve la misma instancia sin re-abrirla.
 */
export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('movienight.db');
  return _db;
}

/**
 * Devuelve la instancia ya abierta de forma síncrona.
 * Solo llamar tras haber ejecutado initDatabase() en el root layout.
 */
export function getDb(): SQLite.SQLiteDatabase {
  if (!_db) {
    throw new Error('Base de datos no inicializada. Llama a initDatabase() primero.');
  }
  return _db;
}
