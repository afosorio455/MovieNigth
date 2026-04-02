// src/services/auth.service.ts

import type { AuthResponse, LoginCredentials } from '../types/auth.types';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

/**
 * Servicio que encapsula las llamadas HTTP al backend de autenticación.
 * Todos los métodos lanzan un Error con mensaje legible si algo falla.
 */
export const authService = {
  /**
   * Inicia sesión con email y contraseña.
   * El backend devuelve access token, refresh token y el perfil del usuario.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message ?? 'Credenciales incorrectas');
    }

    return res.json() as Promise<AuthResponse>;
  },

  /**
   * Registra un nuevo usuario.
   */
  async register(data: {
    email: string;
    password: string;
    name: string;
    avatarColor: string;
  }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message ?? 'No se pudo crear la cuenta');
    }

    return res.json() as Promise<AuthResponse>;
  },

  /**
   * Intercambia el refresh token por un nuevo par de tokens.
   * Retorna null si el refresh token expiró o es inválido.
   */
  async refresh(refreshToken: string): Promise<AuthResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return null;

      return res.json() as Promise<AuthResponse>;
    } catch {
      return null;
    }
  },
};
