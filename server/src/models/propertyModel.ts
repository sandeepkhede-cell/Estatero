import { pool } from '../db/connection';
import { PropertyRow, PropertyFilters, PropertyDTO, PropertyListResponse } from '../types';

const PAGE_SIZE = 12;

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
    price:        row.price,
    pricePerSqft: row.price_per_sqft ? `₹${row.price_per_sqft}/sqft` : undefined,
    emi:          row.emi ? `₹${row.emi.toLocaleString('en-IN')}/mo` : undefined,
    location:     row.location,
    image:        images[0] ?? '',
    images:       images.length > 0 ? images : undefined,
    badge:        row.badge ?? undefined,
    badgeVariant: (row.badge_variant as 'primary' | 'secondary') ?? 'primary',
    isVerified:      row.is_verified,
    listingType:     row.status === 'for_sale' ? 'For Sale'
                   : row.status === 'for_rent' ? 'For Rent'
                   : 'PG',
    area:            row.area_sqft ? `${row.area_sqft} sqft` : undefined,
    floor:           row.floor != null ? `Floor ${row.floor}/${row.total_floors ?? '?'}` : undefined,
    facing:          row.facing        ?? undefined,
    furnishing:      row.furnishing    ?? undefined,
    availability:    row.availability  ?? undefined,
    ageOfProperty:   row.age_of_property ?? undefined,
    isReraRegistered: row.rera_registered,
    reraNumber:      row.rera_number   ?? undefined,
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
    const ptList = Array.isArray(filters.propertyType) ? filters.propertyType : [filters.propertyType];
    if (ptList.length === 1) {
      conditions.push(`p.property_type = $${i++}`);
      params.push(ptList[0]);
    } else {
      conditions.push(`p.property_type = ANY($${i++}::text[])`);
      params.push(ptList);
    }
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
  if (filters.furnishing) {
    const fList = Array.isArray(filters.furnishing) ? filters.furnishing : [filters.furnishing];
    if (fList.length === 1) {
      conditions.push(`p.furnishing = $${i++}`);
      params.push(fList[0]);
    } else {
      conditions.push(`p.furnishing = ANY($${i++}::text[])`);
      params.push(fList);
    }
  }
  if (filters.availability) {
    conditions.push(`p.availability = $${i++}`);
    params.push(filters.availability);
  }
  if (filters.ageOfProperty) {
    conditions.push(`p.age_of_property = $${i++}`);
    params.push(filters.ageOfProperty);
  }
  if (filters.postedBy) {
    if (filters.postedBy === 'owner') {
      conditions.push(`(ag.agency_name IS NULL OR ag.agency_name = '')`);
    } else if (filters.postedBy === 'agent') {
      conditions.push(`(ag.agency_name IS NOT NULL AND ag.agency_name != '')`);
    } else if (filters.postedBy === 'builder') {
      conditions.push(`(ag.agency_name ILIKE '%builder%' OR ag.agency_name ILIKE '%construction%' OR ag.agency_name ILIKE '%developer%')`);
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

// ── Mutations ─────────────────────────────────────────────────────────────────

export interface CreatePropertyInput {
  title: string;
  description?: string;
  price: number;
  price_per_sqft?: number;
  emi?: number;
  location: string;
  city: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  property_type: string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  floor?: number;
  total_floors?: number;
  facing?: string;
  furnishing?: string;
  availability?: string;
  age_of_property?: string;
  rera_registered?: boolean;
  rera_number?: string;
  badge?: string;
  badge_variant?: string;
  is_verified?: boolean;
  is_featured?: boolean;
  agent_id?: number;
  imageUrls?: string[];                          // handled separately — not a DB column
  amenities?: { icon: string; label: string }[]; // handled separately — not a DB column
}

export type UpdatePropertyInput = Partial<CreatePropertyInput>;

export async function createProperty(input: CreatePropertyInput): Promise<PropertyDTO> {
  const { imageUrls, amenities, ...rest } = input;

  const cols = Object.keys(rest) as (keyof typeof rest)[];
  const vals = cols.map((k) => (rest as Record<string, unknown>)[k]);
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

  const { rows } = await pool.query<{ id: number }>(
    `INSERT INTO properties (${cols.join(', ')}) VALUES (${placeholders}) RETURNING id`,
    vals,
  );
  const propertyId = rows[0].id;

  if (imageUrls?.length) {
    const imgValues = imageUrls
      .map((url, i) => `($1, $${i + 2}, ${i === 0}, ${i})`)
      .join(', ');
    await pool.query(
      `INSERT INTO property_images (property_id, url, is_primary, sort_order) VALUES ${imgValues}`,
      [propertyId, ...imageUrls],
    );
  }

  if (amenities?.length) {
    for (const { icon, label } of amenities) {
      const { rows: aRows } = await pool.query<{ id: number }>(
        `INSERT INTO amenities (icon, label) VALUES ($1, $2)
         ON CONFLICT (label) DO UPDATE SET icon = EXCLUDED.icon
         RETURNING id`,
        [icon, label],
      );
      await pool.query(
        `INSERT INTO property_amenities (property_id, amenity_id) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [propertyId, aRows[0].id],
      );
    }
  }

  const created = await findPropertyById(propertyId);
  return created!;
}

export async function updateProperty(id: number, input: UpdatePropertyInput): Promise<PropertyDTO | null> {
  const cols = Object.keys(input) as (keyof UpdatePropertyInput)[];
  if (!cols.length) return findPropertyById(id);

  const sets = cols.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const vals = cols.map((k) => input[k]);
  vals.push(id as unknown as string);

  const { rowCount } = await pool.query(
    `UPDATE properties SET ${sets}, updated_at = NOW() WHERE id = $${cols.length + 1}`,
    vals,
  );
  if (!rowCount) return null;
  return findPropertyById(id);
}

export async function deleteProperty(id: number): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM properties WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}

export async function findPropertiesByAgentUserId(userId: number): Promise<PropertyDTO[]> {
  const { rows } = await pool.query<PropertyRow>(
    `${BASE_SELECT}
     WHERE ag.user_id = $1
     GROUP BY p.id, u.name, u.phone, ag.bio, ag.profile_image
     ORDER BY p.created_at DESC`,
    [userId],
  );
  return rows.map(toDTO);
}

export async function findPropertiesByAgentId(agentId: number): Promise<PropertyDTO[]> {
  const { rows } = await pool.query<PropertyRow>(
    `${BASE_SELECT}
     WHERE p.agent_id = $1
     GROUP BY p.id, u.name, u.phone, ag.bio, ag.profile_image
     ORDER BY p.created_at DESC`,
    [agentId],
  );
  return rows.map(toDTO);
}
