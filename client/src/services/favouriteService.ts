import { api } from './api';
import { Property } from '../types/property';

export const favouriteService = {
  getAll: () =>
    api.get<Property[]>('/favourites'),

  add: (propertyId: number) =>
    api.post<Property>(`/favourites/${propertyId}`, {}),

  remove: (propertyId: number) =>
    api.delete<void>(`/favourites/${propertyId}`),
};
