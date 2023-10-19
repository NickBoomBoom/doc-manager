import { DocTag } from 'interfaces/doc-tag.interface';
import { http } from '../boot/axios';

export const docTagApi = {
  all: () => {
    return http.get('/docTag');
  },
  get: (docTagId: number) => {
    return http.get(`/docTag/${docTagId}`);
  },
  bind: (docTagId: number, data: DocTag) => {
    return http.patch(`/docTag/${docTagId}`, data);
  },
};
