import { defineStore } from 'pinia';
import { Cookies } from 'quasar';
import { User, UserLogin } from 'interfaces/user.interface';
const EXPIRES = 7; // 有效期7天
const cookiesStorage = {
  setItem(key: string, state: any): void {
    Cookies.set(key, state, { expires: EXPIRES });
  },
  getItem(key: string) {
    const value: any = Cookies.get(key);
    return JSON.stringify(value);
  },
};

export const useUserStore = defineStore('user', {
  state: (): User => ({
    id: null,
    email: '',
    name: '',
    rootSpaceId: null,
    token: '',
    expires: null,
  }),
  getters: {
    isLogin: (state) => !!state.token,
  },
  actions: {
    async login(body: UserLogin) {
      const {
        token,
        expires,
        user: { email, name, id, rootSpaceId },
      } = await userApi.login(body);
      this.id = id;
      this.email = email;
      this.name = name;
      this.rootSpaceId = rootSpaceId;
      this.expires = expires;
      this.token = token;
    },

    async logout() {
      this.id = null;
      this.email = '';
      this.name = '';
      this.rootSpaceId = null;
      this.token = '';
      this.expires = null;
    },
  },
  persist: {
    storage: cookiesStorage,
  },
});
