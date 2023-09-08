/* eslint-disable @typescript-eslint/ban-ts-comment */
import { boot } from 'quasar/wrappers';
import { Notify } from 'quasar';
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: AxiosInstance;
  }
}

interface RequestConfig extends InternalAxiosRequestConfig {
  _config?: any;
}

type HttpRequest = (
  url: string,
  params?: object | null,
  config?: any,
) => Promise<any>;

function handleError(message: string) {
  Notify.create({
    message,
    progress: true,
    type: 'negative',
    position: 'top',
  });
}

const { BASE_URL } = process.env;
const request = axios.create({ baseURL: BASE_URL });
// 添加请求拦截器
request.interceptors.request.use(
  async (config: RequestConfig) => {
    const { _config } = config; // _config 覆盖当前配置
    const userStore = useUserStore();
    const headers = {
      ...config.headers,
      ...(_config?.headers || {}),
      Authorization: userStore.token,
    };
    return {
      ...config,
      ...(_config || {}),
      headers,
    };
  },
  (error) => {
    handleError(error?.message || error);
    return Promise.reject(error);
  },
);

// 添加响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, status } = response;
    if (status >= 200 && status < 300) {
      const { code, data: res, message } = data;
      if (!code || !message) {
        return data;
      } else if ([200].includes(code)) {
        return res;
      } else {
        const errorMessage = `${code}: ${message}`;
        handleError(errorMessage);
        return Promise.reject(errorMessage);
      }
    } else {
      return Promise.reject(`请求异常: ${status}`);
    }
  },
  (error) => {
    handleError(error?.message || error);
    return Promise.reject(error);
  },
);

const http: {
  get: HttpRequest;
  post: HttpRequest;
  patch: HttpRequest;
  delete: HttpRequest;
} = {
  get: (url: string, params?: object | null, _config?: any) => {
    // @ts-ignore
    return request({
      url,
      params,
      method: 'get',
      _config,
    });
  },
  post: (url: string, data?: object | null, _config?: any) => {
    // @ts-ignore
    return request({
      url,
      data,
      method: 'post',
      _config,
    });
  },
  patch: (url: string, data?: object | null, _config?: any) => {
    // @ts-ignore
    return request({
      url,
      data,
      method: 'patch',
      _config,
    });
  },
  delete: (url: string, params?: object | null, _config?: any) => {
    // @ts-ignore
    return request({
      url,
      params,
      method: 'delete',
      _config,
    });
  },
};

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$http = http;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
  // app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { http };
