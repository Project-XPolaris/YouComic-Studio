import { extend } from 'umi-request';
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
        Authorization: token,
      },
    };
  }
  return {
    url: localStorage.getItem(YOUCOMIC_SERVER_URL_KEY) + url,
    options: newOption,
  };
};
const errorHandler = function(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.status);
    console.log(error.response.headers);
    console.log(error.data);
    console.log(error.request);
  } else {
    // The request was made but no response was received or error occurs when setting up the request.
    console.log(error.message);
  }

  throw error; // If throw. The error will continue to be thrown.

  // return {some: 'data'}; If return, return the value as a return. If you don't write it is equivalent to return undefined, you can judge whether the response has a value when processing the result.
  // return {some: 'data'};
};

const request = extend({
  errorHandler,
});
request.interceptors.request.use(interceptor);
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem(ApplicationConfig.AUTH_USER_TOKEN_KEY);
  return (
    {
      options: {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': token,
        },
      },
    }
  );
});
export default request;
