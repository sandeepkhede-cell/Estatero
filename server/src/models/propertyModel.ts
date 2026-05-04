import { pool } from '../db/connection';
import { PropertyRow, PropertyFilters, PropertyDTO, PropertyListResponse } from '../types';

const PAGE_SIZE = 12;

// ── Format helpers ────────────────────────────────────────────────────────────

function formatPrice(rupees: number): string {
  if (rupees >= 10_000_000) return `₹${(rupees / 10_000_000).toFixed(2)} Cr`;
  if (rupees >= 100_000)    return `₹${(rupees / 100_000).toFixed(2)} L`;
  return `₹${rupees.toLocaleString('en-IN')}`;
}

function toDTO(row: PropertyRow): PropertyDTO {
  const meta = [];
  if (row.bedrooms)  meta.push({ icon: 'bed',        value: `${row.bedrooms} BHK` });
  if (row.bathrooms) meta.push({ icon: 'bathtub',     value: `${row.bathrooms} Bath` });
  if (row.area_sqft) meta.push({ icon: 'square_foot', value: `${row.area_sqft} sqft` });

  const images = row.images?.filter(Boolean) ?? [];

  return {
    id:           row.id,
    title:        row.title,
    description:  row.description ?? '',
    price:        formatPrice(row.price),
    pricePerSqft: row.price_per_sqft ? `₹${row.price_per_sqft}/sqft` : undefined,
    emi:          row.emi ? `₹${row.emi.toLocaleString('en-IN')}/mo` : undefined,
    location:     row.location,
    image:        images[0] ?? '',
    images:       images.length > 0 ? images : undefined,
    badge:        row.badge ?? undefined,
    badgeVariant: (row.badge_variant as 'primary' | 'secondary') ?? 'primary',
    isVerified:   row.is_verified,
    status:       row.status === 'for_sale' ? 'For Sale' : 'For Rent',
    area:         row.area_sqft ? `${row.area_sqft} sqft` : undefined,
    floor:        row.floor != null ? `Floor ${row.floor}/${row.total_floors ?? '?'}` : undefined,
    facing:       row.facing ?? undefined,
    meta,
    amenities:    row.amenities ?? undefined,
    nearbyPlaces: row.nearby_places ?? undefined,
    agent: row.agent_name ? {
      id:     row.agent_id!,
      name:   row.agent_name,
      role:   row.agent_role ?? 'Agent',
      avatar: row.agent_avatar ?? '',
      phone:  row.agent_phone ?? undefined,
    } : undefined,
  };
}

// ── Base SELECT with all joins ────────────────────────────────────────────────

const BASE_SELECT = `
  SELECT
    p.*,
    COALESCE(
      ARRAY_AGG(pi.url ORDER BY pi.sort_order) FILTER (WHERE pi.url IS NOT NULL),
      '{}'
    ) AS images,
    u.name          AS agent_name,
    u.phone         AS agent_phone,
    ag.bio          AS agent_role,
    ag.profile_image AS agent_avatar,
    COALESCE(
      JSON_AGG(DISTINCT jsonb_build_object('icon', am.icon, 'label', am.label))
        FILTER (WHERE am.id IS NOT NULL),
      '[]'
    ) AS amenities,
    COALESCE(
      JSON_AGG(DISTINCT jsonb_build_object('icon', np.icon, 'name', np.name, 'distance', np.distance))
        FILTER (WHERE np.id IS NOT NULL),
      '[]'
    ) AS nearby_places
  FROM properties p
  LEFT JOIN property_images   pi ON pi.property_id = p.id
  LEFT JOIN agents            ag ON ag.id = p.agent_id
  LEFT JOIN users             u  ON u.id  = ag.user_id
  LEFT JOIN property_amenities pa ON pa.property_id = p.id
  LEFT JOIN amenities         am ON am.id = pa.amenity_id
  LEFT JOIN nearby_places     np ON np.property_id = p.id
`;

// ── Queries ───────────────────────────────────────────────────────────────────

export async function findProperties(filters: PropertyFilters): Promise<PropertyListResponse> {
  const page  = Math.max(1, filters.page ?? 1);
  const limit = filters.limit ?? PAGE_SIZE;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (filters.city) {
    conditions.push(`LOWER(p.city) = LOWER($${i++})`);
    params.push(filters.city);
  }
  if (filters.propertyType) {
    conditions.push(`p.property_type = $${i++}`);
    params.push(filters.propertyType);
  }
  if (filters.status) {
    conditions.push(`p.status = $${i++}`);
    params.push(filters.status);
  }
  if (filters.priceRange) {
    conditions.push(`p.price <= $${i++}`);
    params.push(filters.priceRange);
  }
  if (filters.bhk) {
    const bhkList = Array.isArray(filters.bhk) ? filters.bhk : [filters.bhk];
    const nums = bhkList.map(Number).filter((n) => !isNaN(n));
    if (nums.length) {
      conditions.push(`p.bedrooms = ANY($${i++}::int[])`);
      params.push(nums);
    }
  }
  if (filters.q) {
    conditions.push(
      `to_tsvector('english', p.title || ' ' || p.location || ' ' || p.city)
       @@ plainto_tsquery('english', $${i++})`
    );
    params.push(filters.q);
  }

  const WHERE = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const ORDER = {
    newest:     'p.created_at DESC',
    price_asc:  'p.price ASC',
    price_desc: 'p.price DESC',
  }[filters.sortBy ?? 'newest'] ?? 'p.created_at DESC';

  const dataSQL = `
    ${BASE_SELECT}
    ${WHERE}
    GROUP BY p.id, u.name, u.phone, ag.bio, ag.profile_image
    ORDER BY ${ORDER}
    LIMIT $${i++} OFFSET $${i++}
  `;
  params.push(limit, offset);

  const countSQL = `SELECT COUNT(*) FROM properties p ${WHERE}`;

  const [dataRes, countRes] = await Promise.all([
    pool.query<PropertyRow>(dataSQL, params),
    pool.query<{ count: string }>(countSQL, params.slice(0, -2)),
  ]);

  const total      = parseInt(countRes.rows[0].count, 10);
  const totalPages = Math.ceil(total / limit);

  return {
    properties: dataRes.rows.map(toDTO),
    total,
    page,
    totalPages,
  };
}

export async function findPropertyById(id: number): Promise<PropertyDTO | null> {
  const { rows } = await pool.query<PropertyRow>(
    `${BASE_SELECT}
     WHERE p.id = $1
     GROUP BY p.id, u.name, u.phone, ag.bio, ag.profile_image`,
    [id]
  );
  return rows[0] ? toDTO(rows[0]) : null;
}

export async function findFeaturedProperties(): Promise<PropertyDTO[]> {
  const { rows } = await pool.query<PropertyRow>(
    `${BASE_SELECT}
     WHERE p.is_featured = TRUE
     GROUP BY p.id, u.name, u.phone, ag.bio, ag.profile_image
     ORDER BY p.created_at DESC
     LIMIT 8`
  );
  return rows.map(toDTO);
}

export async function searchProperties(q: string): Promise<PropertyDTO[]> {
  const { rows } = await pool.query<PropertyRow>(
    `${BASE_SELECT}
     WHERE to_tsvector('english', p.title || ' ' || p.location || ' ' || p.city)
           @@ plainto_tsquery('english', $1)
     GROUP BY p.id, u.name, u.phone, ag.bio, ag.profile_image
     ORDER BY p.created_at DESC
     LIMIT 20`,
    [q]
  );
  return rows.map(toDTO);
}
