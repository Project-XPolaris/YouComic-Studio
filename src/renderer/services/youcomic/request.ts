import { extend } from 'umi-request';
import { baseUrl } from '@/services/youcomic/config';
import { ApplicationConfig } from '@/config';
import { YOUCOMIC_SERVER_URL_KEY } from '@/pages/Setting/settings';

const interceptor = (url, options) => {
  const token = localStorage.getItem(ApplicationConfig.AUTH_USER_TOKEN_KEY);
  let newOption = options;

  if (token) {
    newOption = {
      ...options,
      headers: {
        ...newOption.headers,
        'Authorization': token,
      },
    };
  }
  return (
    {
      url: localStorage.getItem(YOUCOMIC_SERVER_URL_KEY) + url,
      options: newOption,
    }
  );
};
const request = extend({
});
request.interceptors.request.use(interceptor);
export default request;



