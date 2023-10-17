import { NoteTag } from 'interfaces/note-tag.interface';
import { http } from '../boot/axios';

export const noteTagApi = {
  all: () => {
    return http.get('/noteTag');
  },
  get: (noteTagId: number) => {
    return http.get(`/noteTag/${noteTagId}`);
  },
  bind: (noteTagId: number, data: NoteTag) => {
    return http.patch(`/noteTag/${noteTagId}`, data);
  },
};
