import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { Express, Request, Response, NextFunction } from 'express';
import { db, UserRow } from './db';

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// This app is the identity provider shared with the sibling smart-teacher
// repo: JWT_SECRET must be the same value in both deployments' env so
// smart-teacher's server can verify tokens issued here without calling back
// over the network or sharing a database. Tokens carry the full profile in
// their payload (not just a user id) so a verifying server never needs DB
// access to know who's making the request — see server/auth.ts in
// smart-teacher, which has no database at all.
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET setup missing in environment.');
  }
  return secret;
}

// Password hashing via Node's built-in scrypt (no extra native dependency),
// stored as "salt:hash", both hex-encoded. verifyPassword uses a
// constant-time comparison to avoid timing attacks.
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  municipality: string;
}

function toAuthUser(row: UserRow): AuthUser {
  return { id: row.id, name: row.name, email: row.email, role: row.role, municipality: row.municipality };
}

function issueToken(user: AuthUser): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: TOKEN_TTL_SECONDS });
}

function getUserFromAuthHeader(req: Request): AuthUser | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload & AuthUser;
    return { id: payload.id, name: payload.name, email: payload.email, role: payload.role, municipality: payload.municipality };
  } catch {
    return null;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getUserFromAuthHeader(req);
  if (!user) {
    res.status(401).json({ error: 'Não autenticado.' });
    return;
  }
  req.user = user;
  next();
}

// Includes 'Professor(a)' because this app is also the identity provider
// for the sibling smart-teacher app, whose users are teachers.
const VALID_ROLES = [
  'Secretário(a) de Educação',
  'Diretor(a) Escolar',
  'Coordenador(a) Pedagógico(a)',
  'Técnico(a) de TI',
  'Professor(a)',
];

export function registerAuthRoutes(app: Express) {
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role, municipality } = req.body || {};

    if (!name || !email || !password || !role || !municipality) {
      res.status(400).json({ error: 'Nome, e-mail, senha, cargo e município são obrigatórios.' });
      return;
    }
    if (String(password).length < 8) {
      res.status(400).json({ error: 'A senha precisa ter ao menos 8 caracteres.' });
      return;
    }
    if (!VALID_ROLES.includes(role)) {
      res.status(400).json({ error: 'Cargo inválido.' });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      res.status(409).json({ error: 'Já existe uma conta com este e-mail.' });
      return;
    }

    const passwordHash = hashPassword(password);
    const info = db
      .prepare('INSERT INTO users (name, email, password_hash, role, municipality) VALUES (?, ?, ?, ?, ?)')
      .run(String(name).trim(), normalizedEmail, passwordHash, role, String(municipality).trim());

    const user: AuthUser = {
      id: Number(info.lastInsertRowid),
      name: String(name).trim(),
      email: normalizedEmail,
      role,
      municipality: String(municipality).trim(),
    };
    res.status(201).json({ user, token: issueToken(user) });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail) as UserRow | undefined;
    if (!row || !verifyPassword(password, row.password_hash)) {
      res.status(401).json({ error: 'E-mail ou senha inválidos.' });
      return;
    }

    const user = toAuthUser(row);
    res.json({ user, token: issueToken(user) });
  });

  // Stateless tokens: nothing to invalidate server-side. Logout is purely a
  // client-side action (drop the stored token); this endpoint exists so the
  // frontend has a consistent API to call.
  app.post('/api/auth/logout', (_req, res) => {
    res.json({ success: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getUserFromAuthHeader(req);
    if (!user) {
      res.status(401).json({ error: 'Não autenticado.' });
      return;
    }
    res.json({ user });
  });
}
