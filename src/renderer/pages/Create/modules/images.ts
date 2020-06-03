import { Effect, Reducer } from '@@/plugin-dva/connect';
import { readImageInfo } from '@/services/image';
import { path as nodePath } from '@/global';

export interface ImageInfo {
  width: number
  height: number
}
export  interface ImagesModuleStateType {
  imagesInfo: { [key: string]: ImageInfo }
}
export interface ImagesModuleTypes {
  state: ImagesModuleStateType,
  reducers: {
    addImageInfo: Reducer
  },
  effects: {
    readImageInfo: Effect
  }
}

export const ImagesModule: ImagesModuleTypes = {
  state: {
    imagesInfo: {},
  },
  reducers: {
    addImageInfo(state, { payload: { key, info } }) {
      return {
        ...state,
        imagesInfo: {
          ...state.imagesInfo,
          [key]: info,
        },
      };
    },
  },
  effects: {
    * readImageInfo({ payload: { path } }, { call, put }) {
      const imageMeta = yield call(readImageInfo, { imagePath: path });
      const imageFilename = nodePath.basename(path);
      yield put({
        type: 'addImageInfo',
        payload: {
          key: imageFilename,
          info: imageMeta,
        },
      });
    },
  },
};
