import { Tag } from 'interfaces/tag.interface';
import { http } from '../boot/axios';

export const tagApi = {
  create: (data: Tag) => {
    return http.post('/tag', data);
  },
  delete: (id: number) => {
    return http.delete(`/tag/${id}`);
  },
  all: () => {
    return http.get('/tag');
  },
};
