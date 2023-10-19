import { http } from '../boot/axios';
import { MenuMove } from 'interfaces/menu.interface';

export const menuApi = {
  get: () => {
    return http.get('/menu');
  },
  getAll: () => {
    return http.get('/menu');
  },
  move: (data: MenuMove) => {
    return http.post('/menu/move', data);
  },
};
