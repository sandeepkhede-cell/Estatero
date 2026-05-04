import { Request, Response, NextFunction } from 'express';
import * as propertyModel from '../models/propertyModel';
import { PropertyFilters } from '../types';

export async function getProperties(req: Request, res: Response, next: NextFunction) {
  try {
    const filters: PropertyFilters = {
      city:         req.query.city         as string,
      propertyType: req.query.propertyType as string,
      status:       req.query.status       as string,
      bhk:          req.query.bhk          as string | string[],
      priceRange:   req.query.priceRange   ? Number(req.query.priceRange) : undefined,
      sortBy:       req.query.sortBy       as PropertyFilters['sortBy'],
      q:            req.query.q            as string,
      page:         req.query.page         ? Number(req.query.page) : 1,
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
