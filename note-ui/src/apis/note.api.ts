import { http } from '../boot/axios';
import { NoteUpdate } from 'interfaces/note.interface';

export const noteApi = {
  update: (id: number, data: NoteUpdate) => {
    return http.patch(`/note/${id}`, data);
  },
  get: (id: number) => {
    return http.get(`/note/${id}`);
  },
  add: (data: NoteUpdate) => {
    return http.post('/note', data);
  },
};
