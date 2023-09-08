import { CategoryUpdate } from 'interfaces/category.interface';
import { http } from '../boot/axios';

export const categoryApi = {
  update: (id: number, data: CategoryUpdate) => {
    return http.patch(`/category/${id}`, data);
  },
  add: (data: CategoryUpdate) => {
    return http.post('/category', data);
  },
  delete: (id: number) => {
    return http.delete(`/category/${id}`);
  },
};
