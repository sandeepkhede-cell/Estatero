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
    isVerified:    row.is_verified,
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
            ag.bio, ag.profile_image, ag.rating, ag.listings_count, ag.is_verified,
            u.name, u.phone
     FROM agents ag
     JOIN users u ON u.id = ag.user_id
     ${where}
     ORDER BY ag.is_verified DESC, ag.listings_count DESC, ag.rating DESC`,
    values,
  );
  return rows.map(toDTO);
}

export async function findAgentById(id: number): Promise<AgentDTO | null> {
  const { rows } = await pool.query<AgentRow & { response_rate: number; avg_response_hours: number }>(
    `SELECT
       ag.id, ag.user_id, ag.agency_name, ag.license_number,
       ag.bio, ag.profile_image, ag.rating, ag.listings_count, ag.is_verified,
       u.name, u.phone,
       ROUND(
         100.0 * COUNT(i.replied_at) FILTER (WHERE i.replied_at IS NOT NULL)
         / NULLIF(COUNT(i.id), 0)
       ) AS response_rate,
       ROUND(
         AVG(EXTRACT(EPOCH FROM (i.replied_at - i.created_at)) / 3600.0)
         FILTER (WHERE i.replied_at IS NOT NULL)
       ) AS avg_response_hours
     FROM agents ag
     JOIN users u ON u.id = ag.user_id
     LEFT JOIN properties p ON p.agent_id = ag.id
     LEFT JOIN inquiries  i ON i.property_id = p.id
     WHERE ag.id = $1
     GROUP BY ag.id, u.name, u.phone`,
    [id]
  );
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    ...toDTO(row),
    responseRate:      row.response_rate     ? Number(row.response_rate)     : undefined,
    avgResponseHours:  row.avg_response_hours ? Number(row.avg_response_hours) : undefined,
  };
}

export interface AgentProfileDTO {
  id:               number;
  agencyName:       string | null;
  bio:              string | null;
  licenseNumber:    string | null;
  profileImage:     string | null;
  rating:           number;
  listingsCount:    number;
  isVerified:       boolean;
  responseRate?:    number;
  avgResponseHours?: number;
}

export interface UpdateAgentProfileInput {
  agencyName?:    string | null;
  bio?:           string | null;
  licenseNumber?: string | null;
  profileImage?:  string | null;
}

export async function findAgentByUserId(userId: number): Promise<AgentProfileDTO | null> {
  const { rows } = await pool.query<{
    id: number; agency_name: string | null; bio: string | null;
    license_number: string | null; profile_image: string | null;
    rating: string; listings_count: number; is_verified: boolean;
    response_rate: string | null; avg_response_hours: string | null;
  }>(
    `SELECT ag.id, ag.agency_name, ag.bio, ag.license_number, ag.profile_image,
            ag.rating, ag.listings_count, ag.is_verified,
            ROUND(
              100.0 * COUNT(i.replied_at) FILTER (WHERE i.replied_at IS NOT NULL)
              / NULLIF(COUNT(i.id), 0)
            ) AS response_rate,
            ROUND(
              AVG(EXTRACT(EPOCH FROM (i.replied_at - i.created_at)) / 3600.0)
              FILTER (WHERE i.replied_at IS NOT NULL)
            ) AS avg_response_hours
     FROM agents ag
     LEFT JOIN properties p ON p.agent_id = ag.id
     LEFT JOIN inquiries  i ON i.property_id = p.id
     WHERE ag.user_id = $1
     GROUP BY ag.id`,
    [userId],
  );
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    id: r.id, agencyName: r.agency_name, bio: r.bio,
    licenseNumber: r.license_number, profileImage: r.profile_image,
    rating: parseFloat(r.rating), listingsCount: r.listings_count,
    isVerified: r.is_verified,
    responseRate:     r.response_rate      ? Number(r.response_rate)      : undefined,
    avgResponseHours: r.avg_response_hours ? Number(r.avg_response_hours) : undefined,
  };
}

export async function upsertAgentProfile(userId: number, input: UpdateAgentProfileInput): Promise<AgentProfileDTO> {
  const { rows } = await pool.query<{
    id: number; agency_name: string | null; bio: string | null;
    license_number: string | null; profile_image: string | null;
    rating: string; listings_count: number; is_verified: boolean;
  }>(
    `INSERT INTO agents (user_id, agency_name, bio, license_number, profile_image)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) DO UPDATE SET
       agency_name    = EXCLUDED.agency_name,
       bio            = EXCLUDED.bio,
       license_number = EXCLUDED.license_number,
       profile_image  = EXCLUDED.profile_image
     RETURNING id, agency_name, bio, license_number, profile_image, rating, listings_count, is_verified`,
    [userId, input.agencyName ?? null, input.bio ?? null, input.licenseNumber ?? null, input.profileImage ?? null],
  );
  const r = rows[0];
  return {
    id: r.id, agencyName: r.agency_name, bio: r.bio,
    licenseNumber: r.license_number, profileImage: r.profile_image,
    rating: parseFloat(r.rating), listingsCount: r.listings_count,
    isVerified: r.is_verified,
  };
}

export interface InquiryPayload {
  agentId?:    number | null;
  propertyId?: number | null;
  name?:       string;
  email?:      string;
  phone?:      string;
  message:     string;
}

export async function saveContactInquiry(payload: InquiryPayload): Promise<void> {
  const { rows } = await pool.query<{ id: number }>(
    `INSERT INTO inquiries (agent_id, property_id, sender_name, sender_email, sender_phone, message)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [
      payload.agentId    ?? null,
      payload.propertyId ?? null,
      payload.name       ?? null,
      payload.email      ?? null,
      payload.phone      ?? null,
      payload.message,
    ],
  );
  await pool.query(
    `INSERT INTO inquiry_messages (inquiry_id, sender_type, sender_name, content)
     VALUES ($1, 'buyer', $2, $3)`,
    [rows[0].id, payload.name ?? null, payload.message],
  );
}
