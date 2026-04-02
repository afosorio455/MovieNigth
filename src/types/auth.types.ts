// src/types/auth.types.ts

/**
 * Representa un usuario autenticado en la aplicación.
 * Estos datos se persisten en SQLite (no son sensibles).
 */
export interface User {
    id: string;
    email: string;
    name: string;
    avatarColor: string;
    avatarUrl?: string;
    createdAt?: string;
}

/**
 * Credenciales para el login.
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Datos para el registro de un nuevo usuario.
 */
export interface RegisterData {
    email: string;
    password: string;
    name: string;
    avatarColor: string;
}

/**
 * Respuesta del servidor al hacer login o refresh.
 */
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // segundos hasta expiración
    user: User;
}

/**
 * Datos de sesión almacenados en SecureStore.
 * Solo tokens y metadata de expiración.
 */
export interface SecureSession {
    accessToken: string;
    refreshToken: string;
    expiresAt: number; // timestamp en milisegundos
}

/**
 * Estado completo de autenticación en Zustand.
 */
export interface AuthState {
    // Estado
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isHydrated: boolean; // ¿Ya cargamos datos persistidos?

    // Acciones
    initialize: () => Promise<void>;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<boolean>;
}