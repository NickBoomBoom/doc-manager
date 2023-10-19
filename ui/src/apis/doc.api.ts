import { http } from '../boot/axios';
import { Doc } from 'interfaces/doc.interface';

export const docApi = {
  update: (id: number, data: Doc) => {
    return http.patch(`/doc/${id}`, data);
  },
  get: (id: number) => {
    return http.get(`/doc/${id}`);
  },
  add: (data: Doc) => {
    return http.post('/doc', data);
  },
  delete: (id: number) => {
    return http.delete(`/doc/${id}`);
  },
};
