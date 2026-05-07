import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  findFavouriteProperties,
  findPropertyById,
  addFavourite,
  removeFavourite,
} from '../models/propertyModel';

export async function getMyFavourites(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const properties = await findFavouriteProperties(req.user!.userId);
    res.json(properties);
  } catch (err) { next(err); }
}

export async function addToFavourites(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const propertyId = parseInt(req.params.propertyId, 10);
    if (isNaN(propertyId)) { res.status(400).json({ error: 'Invalid property ID' }); return; }

    const property = await findPropertyById(propertyId);
    if (!property) { res.status(404).json({ error: 'Property not found' }); return; }

    await addFavourite(req.user!.userId, propertyId);
    res.status(201).json(property);
  } catch (err) { next(err); }
}

export async function removeFromFavourites(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const propertyId = parseInt(req.params.propertyId, 10);
    if (isNaN(propertyId)) { res.status(400).json({ error: 'Invalid property ID' }); return; }

    await removeFavourite(req.user!.userId, propertyId);
    res.status(204).send();
  } catch (err) { next(err); }
}
