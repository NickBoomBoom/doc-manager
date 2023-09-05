import { http } from '../boot/axios';

export const userApi = {
  checkEmail: (email) => {
    return http.get(`/user/check/email/${email}`);
  },
};
