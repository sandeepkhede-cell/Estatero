import { Request, Response } from 'express';
import { pool } from '../db/connection';
import { hashPassword, verifyPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as { name: string; email: string; password: string };

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: 'name, email and password are required' });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters' });
    return;
  }

  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (exists.rowCount) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const hash = await hashPassword(password);
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at`,
    [name.trim(), email.toLowerCase(), hash],
  );
  const user = rows[0];
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

export const me = async (req: AuthRequest, res: Response) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1',
    [req.user!.userId],
  );
  if (!rows[0]) { res.status(404).json({ error: 'User not found' }); return; }
  res.json(rows[0]);
};
