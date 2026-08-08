import React, { createContext, useContext, useEffect, useState } from 'react';

// This app is the identity provider shared with the sibling smart-teacher
// app (see server/auth.ts) — the token issued here is a JWT that any server
// holding the same JWT_SECRET can verify on its own, with no DB/network
// call back to this app.
const TOKEN_STORAGE_KEY = 'educacao_auth_token';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  municipality: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  municipality: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

// fetch wrapper that attaches the bearer token; use this for any call to a
// requireAuth-protected endpoint (e.g. /api/radar-analysis).
export function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

async function parseJsonError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authFetch('/api/auth/me');
        if (!res.ok) throw new Error('Sessão expirada');
        const data = await res.json();
        setUser(data.user);
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const message = await parseJsonError(res, 'Falha no login.');
      setError(message);
      throw new Error(message);
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setUser(data.user);
  };

  const register = async (payload: RegisterPayload) => {
    setError(null);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const message = await parseJsonError(res, 'Falha no cadastro.');
      setError(message);
      throw new Error(message);
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
