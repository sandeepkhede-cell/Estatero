import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as userModel from '../models/userModel';
import { findPropertiesByAgentUserId } from '../models/propertyModel';

export async function getUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid user ID' }); return; }

    const user = await userModel.findById(id);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid user ID' }); return; }

    if (req.user!.userId !== id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const { name, phone } = req.body as userModel.UpdateUserInput;
    const user = await userModel.updateById(id, { name, phone });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getUserProperties(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid user ID' }); return; }

    const properties = await findPropertiesByAgentUserId(id);
    res.json(properties);
  } catch (err) {
    next(err);
  }
}
