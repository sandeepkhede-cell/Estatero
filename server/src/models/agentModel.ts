import { pool } from '../db/connection';
import { AgentRow, AgentDTO } from '../types';

function toDTO(row: AgentRow): AgentDTO {
  return {
    id:            row.id,
    name:          row.name,
    role:          row.agency_name ?? 'Independent Agent',
    avatar:        row.profile_image ?? '',
    phone:         row.phone ?? undefined,
    bio:           row.bio ?? undefined,
    rating:        parseFloat(row.rating),
    listingsCount: row.listings_count,
  };
}

export async function findAllAgents(search?: string): Promise<AgentDTO[]> {
  const values: unknown[] = [];
  let where = '';

  if (search?.trim()) {
    values.push(`%${search.trim()}%`);
    where = `WHERE u.name ILIKE $1 OR ag.agency_name ILIKE $1`;
  }

  const { rows } = await pool.query<AgentRow>(
    `SELECT ag.id, ag.user_id, ag.agency_name, ag.license_number,
            ag.bio, ag.profile_image, ag.rating, ag.listings_count,
            u.name, u.phone
     FROM agents ag
     JOIN users u ON u.id = ag.user_id
     ${where}
     ORDER BY ag.listings_count DESC, ag.rating DESC`,
    values,
  );
  return rows.map(toDTO);
}

export async function findAgentById(id: number): Promise<AgentDTO | null> {
  const { rows } = await pool.query<AgentRow>(
    `SELECT
       ag.id, ag.user_id, ag.agency_name, ag.license_number,
       ag.bio, ag.profile_image, ag.rating, ag.listings_count,
       u.name, u.phone
     FROM agents ag
     JOIN users u ON u.id = ag.user_id
     WHERE ag.id = $1`,
    [id]
  );
  return rows[0] ? toDTO(rows[0]) : null;
}

export interface InquiryPayload {
  agentId:     number;
  propertyId?: number;
  name?:       string;
  email?:      string;
  phone?:      string;
  message:     string;
}

export async function saveContactInquiry(payload: InquiryPayload): Promise<void> {
  await pool.query(
    `INSERT INTO inquiries (agent_id, property_id, sender_name, sender_email, sender_phone, message)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      payload.agentId,
      payload.propertyId ?? null,
      payload.name       ?? null,
      payload.email      ?? null,
      payload.phone      ?? null,
      payload.message,
    ],
  );
}
