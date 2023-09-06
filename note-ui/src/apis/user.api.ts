import { UserLogin } from 'interfaces/user.interface';
import { http } from '../boot/axios';

export const userApi = {
  checkEmail: (email: string) => {
    return http.get(`/user/check/email/${email}`);
  },
  login: (data: UserLogin) => {
    return http.post('/user/login', data);
  },
};
