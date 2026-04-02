// src/stores/auth.store.ts

import { create } from 'zustand';
import { userRepository } from '../database/users';
import { authService } from '../services/auth.service';
import { secureStorageService } from '../services/secure-storage.service';
import type { AuthState, LoginCredentials, RegisterData } from '../types/auth.types';
import type { User } from '../types/auth.types';

/** Token prefijado con "local_" indica sesión creada sin conexión. */
const LOCAL_TOKEN_PREFIX = 'local_';

function generateLocalToken(): string {
  return LOCAL_TOKEN_PREFIX + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function isLocalToken(token: string): boolean {
  return token.startsWith(LOCAL_TOKEN_PREFIX);
}

/**
 * Detecta errores de red (sin conexión, timeout, DNS).
 * Los errores del servidor (4xx, 5xx) NO son errores de red.
 */
function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes('network') ||
    msg.includes('fetch') ||
    msg.includes('timeout') ||
    msg.includes('connection') ||
    msg.includes('failed to fetch') ||
    msg.includes('network request failed')
  );
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,

  /**
   * Hidrata el estado desde SecureStore + SQLite.
   * Llamar una sola vez al arrancar la app (en el root layout).
   *
   * Flujo:
   *  1. Leer la sesión de SecureStore.
   *  2. Si no hay sesión → no autenticado.
   *  3. Si es sesión local (token "local_*") → cargar usuario de SQLite directamente.
   *  4. Si es sesión JWT → validar/renovar y cargar usuario de SQLite.
   */
  initialize: async () => {
    set({ isLoading: true });
    try {
      const session = await secureStorageService.getSession();

      if (!session) {
        set({ isHydrated: true, isLoading: false });
        return;
      }

      // Sesión local creada sin conexión
      if (isLocalToken(session.accessToken)) {
        const user = await userRepository.getCurrent();
        set({
          user,
          token: session.accessToken,
          isAuthenticated: !!user,
          isHydrated: true,
          isLoading: false,
        });
        return;
      }

      // Sesión JWT: renovar si está próxima a expirar
      let accessToken = session.accessToken;
      if (secureStorageService.isTokenExpired(session.expiresAt)) {
        const refreshed = await authService.refresh(session.refreshToken);
        if (!refreshed) {
          await secureStorageService.clearSession();
          set({ isHydrated: true, isLoading: false });
          return;
        }
        accessToken = refreshed.accessToken;
        await secureStorageService.saveSession({
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          expiresAt: Date.now() + refreshed.expiresIn * 1000,
        });
      }

      const user = await userRepository.getCurrent();
      set({
        user,
        token: accessToken,
        isAuthenticated: !!user,
        isHydrated: true,
        isLoading: false,
      });
    } catch {
      set({ isHydrated: true, isLoading: false });
    }
  },

  /**
   * Login con email y contraseña.
   *
   * Offline fallback: si hay error de red, busca el usuario en SQLite
   * y crea una sesión local. La contraseña no se verifica offline
   * (el servidor es la fuente de verdad de seguridad).
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(credentials);

      await secureStorageService.saveSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: Date.now() + response.expiresIn * 1000,
      });
      await userRepository.save(response.user);

      set({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      if (isNetworkError(error)) {
        // Sin conexión: intentar sesión local
        const localUser = await userRepository.findByEmail(credentials.email);
        if (localUser) {
          const localToken = generateLocalToken();
          await secureStorageService.saveSession({
            accessToken: localToken,
            refreshToken: localToken,
            expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 año
          });
          set({
            user: localUser,
            token: localToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
        set({ isLoading: false });
        throw new Error('Sin conexión. Regístrate primero para usar la app offline.');
      }
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Registro de nuevo usuario.
   *
   * Intenta registrar en el servidor. Si hay error de red, guarda el usuario
   * localmente (is_local=1) para sincronizar cuando vuelva la conexión.
   */
  register: async (data: RegisterData) => {
    set({ isLoading: true });
    try {
      const response = await authService.register(data);

      await secureStorageService.saveSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: Date.now() + response.expiresIn * 1000,
      });
      await userRepository.save(response.user);

      set({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      if (isNetworkError(error)) {
        // Sin conexión: crear usuario local
        const localUser: User = {
          id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          email: data.email,
          name: data.name,
          avatarColor: data.avatarColor,
          createdAt: new Date().toISOString(),
        };
        await userRepository.saveLocal(localUser);

        const localToken = generateLocalToken();
        await secureStorageService.saveSession({
          accessToken: localToken,
          refreshToken: localToken,
          expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
        });

        set({
          user: localUser,
          token: localToken,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Cierra la sesión: limpia los tokens de SecureStore y el estado en memoria.
   * El perfil del usuario se mantiene en SQLite para permitir el login offline.
   */
  logout: async () => {
    await secureStorageService.clearSession();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  /**
   * Renueva el access token. No aplica a sesiones locales.
   */
  refreshSession: async () => {
    const { token } = get();
    if (token && isLocalToken(token)) return true; // sesión local siempre válida

    const session = await secureStorageService.getSession();
    if (!session) return false;

    const refreshed = await authService.refresh(session.refreshToken);
    if (!refreshed) {
      await get().logout();
      return false;
    }

    const newSession = {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      expiresAt: Date.now() + refreshed.expiresIn * 1000,
    };
    await secureStorageService.saveSession(newSession);
    set({ token: refreshed.accessToken });
    return true;
  },
}));
