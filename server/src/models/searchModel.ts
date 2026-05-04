import { pool } from '../db/connection';
import { LocationSuggestion } from '../types';

export async function getLocationSuggestions(q: string): Promise<LocationSuggestion[]> {
  if (!q.trim()) return [];

  // Distinct cities that match the query
  const { rows: cityRows } = await pool.query<{ city: string }>(
    `SELECT DISTINCT city
     FROM properties
     WHERE LOWER(city) LIKE LOWER($1)
     ORDER BY city
     LIMIT 5`,
    [`${q}%`]
  );

  // Distinct localities (location field) that match
  const { rows: localityRows } = await pool.query<{ location: string }>(
    `SELECT DISTINCT location
     FROM properties
     WHERE LOWER(location) LIKE LOWER($1)
     ORDER BY location
     LIMIT 5`,
    [`%${q}%`]
  );

  const cities: LocationSuggestion[] = cityRows.map((r) => ({
    label: r.city,
    type:  'city',
  }));

  const localities: LocationSuggestion[] = localityRows.map((r) => ({
    label: r.location,
    type:  'locality',
  }));

  // Merge, deduplicate by label
  const seen = new Set<string>();
  return [...cities, ...localities].filter((s) => {
    if (seen.has(s.label)) return false;
    seen.add(s.label);
    return true;
  }).slice(0, 8);
}

export async function getPopularSearches(): Promise<string[]> {
  const { rows } = await pool.query<{ query: string }>(
    `SELECT query
     FROM popular_searches
     ORDER BY count DESC
     LIMIT 8`
  );
  return rows.map((r) => r.query);
}

export async function incrementSearchCount(query: string): Promise<void> {
  await pool.query(
    `INSERT INTO popular_searches (query, count, updated_at)
     VALUES ($1, 1, NOW())
     ON CONFLICT (query) DO UPDATE
       SET count      = popular_searches.count + 1,
           updated_at = NOW()`,
    [query.toLowerCase().trim()]
  );
}
