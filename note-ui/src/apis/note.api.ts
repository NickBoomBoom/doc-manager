import { http } from '../boot/axios';
import { Note } from 'interfaces/note.interface';

export const noteApi = {
  update: (id: number, data: Note) => {
    return http.patch(`/note/${id}`, data);
  },
  get: (id: number) => {
    return http.get(`/note/${id}`);
  },
  add: (data: Note) => {
    return http.post('/note', data);
  },
  delete: (id: number) => {
    return http.delete(`/note/${id}`);
  },
};
