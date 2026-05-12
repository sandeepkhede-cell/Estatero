import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { pool } from '../db/connection';
import { hashPassword, verifyPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';
import { sendPasswordResetEmail } from '../utils/mailer';

const VALID_ROLES = ['buyer', 'agent', 'owner', 'builder'] as const;
type UserRole = typeof VALID_ROLES[number];

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role: rawRole } = req.body as {
    name: string; email: string; password: string; role?: string;
  };

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: 'name, email and password are required' });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters' });
    return;
  }

  const role: UserRole = VALID_ROLES.includes(rawRole as UserRole) ? (rawRole as UserRole) : 'buyer';

  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (exists.rowCount) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const hash = await hashPassword(password);
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name.trim(), email.toLowerCase(), hash, role],
  );
  const user = rows[0];

  // agents, owners and builders get a profile row so they can post properties
  if (role === 'agent' || role === 'owner' || role === 'builder') {
    await pool.query(
      `INSERT INTO agents (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
      [user.id],
    );
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email?.trim() || !password) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }

  const { rows } = await pool.query(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
    [email.toLowerCase()],
  );
  const user = rows[0];

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  if (!email?.trim()) { res.status(400).json({ error: 'email is required' }); return; }

  const { rows } = await pool.query<{ id: number; name: string }>(
    'SELECT id, name FROM users WHERE email = $1',
    [email.toLowerCase().trim()],
  );

  // Always respond 200 to prevent email enumeration
  if (!rows[0]) { res.json({ success: true }); return; }

  const user  = rows[0];
  const token = randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Invalidate any existing unused tokens for this user
  await pool.query(
    `UPDATE password_reset_tokens SET used = TRUE WHERE user_id = $1 AND used = FALSE`,
    [user.id],
  );

  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
    [user.id, token, expiry],
  );

  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
  const resetLink   = `${frontendUrl}/reset-password?token=${token}`;

  sendPasswordResetEmail({ to: email.trim(), toName: user.name, resetLink })
    .catch((err: unknown) => console.error('[mailer] password reset:', err));

  res.json({ success: true });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body as { token?: string; password?: string };

  if (!token?.trim())    { res.status(400).json({ error: 'token is required' }); return; }
  if (!password || password.length < 8) {
    res.status(400).json({ error: 'password must be at least 8 characters' }); return;
  }

  const { rows } = await pool.query<{ id: number; user_id: number; expires_at: Date; used: boolean }>(
    `SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token = $1`,
    [token.trim()],
  );

  const row = rows[0];
  if (!row || row.used)                       { res.status(400).json({ error: 'Invalid or already-used reset link' }); return; }
  if (new Date() > new Date(row.expires_at))  { res.status(400).json({ error: 'Reset link has expired' }); return; }

  const hash = await hashPassword(password);

  await pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [hash, row.user_id]);
  await pool.query(`UPDATE password_reset_tokens SET used = TRUE WHERE id = $1`, [row.id]);

  res.json({ success: true });
};

export const me = async (req: AuthRequest, res: Response) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1',
    [req.user!.userId],
  );
  if (!rows[0]) { res.status(404).json({ error: 'User not found' }); return; }
  res.json(rows[0]);
};
