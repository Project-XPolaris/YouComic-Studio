import { nodeHttp, nodeURL } from '@/global';
import  request  from '@/services/youcomic/request';
import { baseUrl } from '@/services/youcomic/config';

export const createNewBook = ({ name }) => {
  return request.post(`/books`, {
    data: {
      name,
    },
  });
};

export const createTag = ({ name, type }: { name: string, type: string }) => {
  return request.post(`/tags`, {
    data: {
      name, type,
    },
  });
};
export const addTagToBook = ({ bookId, tags }: { bookId: number, tags: number[] }) => {
  return request.put(`/book/${bookId}/tags`, {
    data: {
      tags,
    },
  });
};
export const queryUser = ({id} : {id:number}) => {
  return request.get(`/user/${id}`)
}
export const uploadCover = ({ form, bookId })=>{
  return new Promise((resolve, reject) => {
    const request = nodeHttp.request({
      method: 'put',
      host: nodeURL.parse(baseUrl).host.replace(`:${nodeURL.parse(baseUrl).port}`,""),
      port: nodeURL.parse(baseUrl).port,
      path: `/book/${bookId}/cover`,
      headers: form.getHeaders(),
    });
    form.pipe(request);
    request.on('response', (res) => {
      resolve();
    });
  });
}
export const uploadBookPage = ({ form, bookId }) =>{
  return new Promise((resolve, reject) => {
    const request = nodeHttp.request({
      method: 'put',
      host: nodeURL.parse(baseUrl).host.replace(`:${nodeURL.parse(baseUrl).port}`,""),
      port: nodeURL.parse(baseUrl).port,
      path: `/book/${bookId}/pages`,
      headers: form.getHeaders(),
    });
    form.pipe(request);
    request.on('response', (res) => {
      resolve();
    });
  });
}
export const login = ({ username, password }: { username: string, password: string }) => {
  return request.post(`/user/auth`, {
    data: {
      username, password,
    },
  });
}
export const queryTags = ({ ...queryParams }) => {
  return request.get(`/tags`, {
    params: queryParams,
  });
}
