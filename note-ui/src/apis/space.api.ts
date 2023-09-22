import { SpaceUpdate } from 'interfaces/space.interface';
import { http } from '../boot/axios';

export const spaceApi = {
  update: (id: number, data: SpaceUpdate) => {
    return http.patch(`/space/${id}`, data);
  },
  add: (data: SpaceUpdate) => {
    return http.post('/space', data);
  },
  delete: (id: number) => {
    return http.delete(`/space/${id}`);
  },
};
