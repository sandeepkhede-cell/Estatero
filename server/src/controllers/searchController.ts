import { Request, Response, NextFunction } from 'express';
import * as searchModel from '../models/searchModel';

export async function getSuggestions(req: Request, res: Response, next: NextFunction) {
  try {
    const q = (req.query.q as string) ?? '';
    const suggestions = await searchModel.getLocationSuggestions(q);
    res.json(suggestions);
  } catch (err) {
    next(err);
  }
}

export async function getPopular(_req: Request, res: Response, next: NextFunction) {
  try {
    const searches = await searchModel.getPopularSearches();
    res.json(searches);
  } catch (err) {
    next(err);
  }
}

export async function trackSearch(req: Request, res: Response, next: NextFunction) {
  try {
    const { query } = req.body as { query?: string };
    if (query?.trim()) {
      await searchModel.incrementSearchCount(query);
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
