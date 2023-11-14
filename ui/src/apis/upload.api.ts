import { http } from '../boot/axios';

export const uploadApi = {
  upload: (data: any) => {
    return http.post('/upload', data, {
      'Content-Type': 'multipart/form-data',
    });
  },
  uploadByUrl: (data: any) => {
    return http.post('/upload/url', data);
  },
};
