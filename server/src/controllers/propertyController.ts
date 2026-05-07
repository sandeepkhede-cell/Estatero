import { Request, Response, NextFunction } from 'express';
import * as propertyModel from '../models/propertyModel';
import { saveContactInquiry } from '../models/agentModel';
import { PropertyFilters } from '../types';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';

export async function getProperties(req: Request, res: Response, next: NextFunction) {
  try {
    const filters: PropertyFilters = {
      city:          req.query.city          as string,
      propertyType:  req.query.propertyType  as string | string[],
      status:        req.query.status        as string,
      bhk:           req.query.bhk           as string | string[],
      priceRange:    req.query.priceRange    ? Number(req.query.priceRange) : undefined,
      furnishing:    req.query.furnishing    as string | string[],
      availability:  req.query.availability  as string,
      ageOfProperty: req.query.ageOfProperty as string,
      postedBy:      req.query.postedBy      as string,
      sortBy:        req.query.sortBy        as PropertyFilters['sortBy'],
      q:             req.query.q             as string,
      page:          req.query.page          ? Number(req.query.page) : 1,
    };
    const result = await propertyModel.findProperties(filters);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPropertyById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid property ID' });
      return;
    }
    const property = await propertyModel.findPropertyById(id);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json(property);
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedProperties(_req: Request, res: Response, next: NextFunction) {
  try {
    const properties = await propertyModel.findFeaturedProperties();
    res.json(properties);
  } catch (err) {
    next(err);
  }
}

export async function searchProperties(req: Request, res: Response, next: NextFunction) {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q) {
      res.json([]);
      return;
    }
    const properties = await propertyModel.searchProperties(q);
    res.json(properties);
  } catch (err) {
    next(err);
  }
}

export async function createProperty(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = req.body as propertyModel.CreatePropertyInput;
    if (!input.title || !input.price || !input.location || !input.city || !input.property_type) {
      res.status(400).json({ error: 'title, price, location, city, property_type are required' });
      return;
    }

    // Find or create agent record for the authenticated user, then link it to the property
    const { rows } = await pool.query<{ id: number }>(
      `INSERT INTO agents (user_id) VALUES ($1)
       ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id
       RETURNING id`,
      [req.user!.userId],
    );
    input.agent_id = rows[0].id;

    const property = await propertyModel.createProperty(input);
    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
}

export async function updateProperty(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid property ID' }); return; }

    const ownerUserId = await propertyModel.findPropertyOwnerId(id);
    if (ownerUserId === null) { res.status(404).json({ error: 'Property not found' }); return; }
    if (ownerUserId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

    const property = await propertyModel.updateProperty(id, req.body as propertyModel.UpdatePropertyInput);
    res.json(property);
  } catch (err) {
    next(err);
  }
}

export async function deleteProperty(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid property ID' }); return; }

    const ownerUserId = await propertyModel.findPropertyOwnerId(id);
    if (ownerUserId === null) { res.status(404).json({ error: 'Property not found' }); return; }
    if (ownerUserId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

    await propertyModel.deleteProperty(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function sendPropertyEnquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const propertyId = parseInt(req.params.id, 10);
    if (isNaN(propertyId)) { res.status(400).json({ error: 'Invalid property ID' }); return; }

    const property = await propertyModel.findPropertyById(propertyId);
    if (!property) { res.status(404).json({ error: 'Property not found' }); return; }

    const { message, name, email, phone } =
      req.body as { message?: string; name?: string; email?: string; phone?: string };
    if (!message?.trim()) { res.status(400).json({ error: 'message is required' }); return; }

    await saveContactInquiry({
      agentId:    property.agent?.id ? Number(property.agent.id) : null,
      propertyId,
      name,
      email,
      phone,
      message,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
