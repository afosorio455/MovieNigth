// src/services/secure-storage.service.ts

import * as SecureStore from 'expo-secure-store';
import { SecureSession } from '../types/auth.types';

/**
 * Keys usadas en SecureStore.
 * Centralizadas aquí para evitar typos y facilitar búsquedas.
 */
const KEYS = {
    ACCESS_TOKEN: 'auth_access_token',
    REFRESH_TOKEN: 'auth_refresh_token',
    EXPIRES_AT: 'auth_expires_at',
} as const;

/**
 * Servicio que encapsula todas las operaciones con SecureStore.
 * 
 * SecureStore usa:
 * - iOS: Keychain Services (encriptación AES-256)
 * - Android: Keystore (encriptación respaldada por hardware)
 * 
 * Esto significa que incluso si el dispositivo está rooteado/jailbroken,
 * los tokens están protegidos a nivel de hardware.
 */
export const secureStorageService = {
    /**
     * Guarda los tokens de sesión de forma segura.
     * Usamos operaciones individuales en lugar de JSON para evitar
     * que un error en un campo corrompa toda la sesión.
     */
    async saveSession(session: SecureSession): Promise<void> {
        try {
            // Promise.all para operaciones paralelas (más rápido)
            await Promise.all([
                SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, session.accessToken),
                SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, session.refreshToken),
                SecureStore.setItemAsync(KEYS.EXPIRES_AT, session.expiresAt.toString()),
            ]);
        } catch (error) {
            console.error('[SecureStorage] Error saving session:', error);
            throw new Error('No se pudo guardar la sesión de forma segura');
        }
    },

    /**
     * Recupera la sesión almacenada.
     * Retorna null si no hay sesión o si está incompleta.
     */
    async getSession(): Promise<SecureSession | null> {
        try {
            const [accessToken, refreshToken, expiresAtStr] = await Promise.all([
                SecureStore.getItemAsync(KEYS.ACCESS_TOKEN),
                SecureStore.getItemAsync(KEYS.REFRESH_TOKEN),
                SecureStore.getItemAsync(KEYS.EXPIRES_AT),
            ]);

            // Si falta cualquier campo, no hay sesión válida
            if (!accessToken || !refreshToken || !expiresAtStr) {
                return null;
            }

            return {
                accessToken,
                refreshToken,
                expiresAt: parseInt(expiresAtStr, 10),
            };
        } catch (error) {
            console.error('[SecureStorage] Error getting session:', error);
            return null;
        }
    },

    /**
     * Limpia todos los datos de sesión.
     * Se llama en logout o cuando el refresh token falla.
     */
    async clearSession(): Promise<void> {
        try {
            await Promise.all([
                SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
                SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
                SecureStore.deleteItemAsync(KEYS.EXPIRES_AT),
            ]);
        } catch (error) {
            // No lanzamos error aquí porque el logout debe completarse
            // aunque falle la limpieza del storage
            console.error('[SecureStorage] Error clearing session:', error);
        }
    },

    /**
     * Actualiza solo los tokens (usado después de un refresh).
     * Más eficiente que guardar toda la sesión.
     */
    async updateTokens(
        accessToken: string,
        refreshToken: string,
        expiresAt: number
    ): Promise<void> {
        await this.saveSession({ accessToken, refreshToken, expiresAt });
    },

    /**
     * Verifica si el token actual está expirado.
     * Incluye un buffer de 60 segundos para evitar race conditions.
     */
    isTokenExpired(expiresAt: number): boolean {
        const bufferMs = 60 * 1000; // 1 minuto de buffer
        return Date.now() >= expiresAt - bufferMs;
    },
};