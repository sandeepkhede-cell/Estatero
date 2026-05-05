import { pool } from '../db/connection';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: Date;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
}

export async function findById(id: number): Promise<UserDTO | null> {
  const { rows } = await pool.query<UserDTO>(
    'SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1',
    [id],
  );
  return rows[0] ?? null;
}

export async function updateById(id: number, input: UpdateUserInput): Promise<UserDTO | null> {
  const cols = Object.keys(input) as (keyof UpdateUserInput)[];
  if (!cols.length) return findById(id);

  const sets = cols.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const vals = cols.map((k) => input[k]);
  vals.push(id as unknown as string);

  const { rows } = await pool.query<UserDTO>(
    `UPDATE users SET ${sets} WHERE id = $${cols.length + 1}
     RETURNING id, name, email, phone, role, created_at`,
    vals,
  );
  return rows[0] ?? null;
}
