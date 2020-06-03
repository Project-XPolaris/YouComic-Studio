import { CreateBookModelStateType, Effect, Page, Reducer } from '@@/plugin-dva/connect';
import { readImageInfo } from '@/services/image';


export interface ViewModuleStateTypes {
  currentImageName: string
  zoomRatio: number
}

export interface ViewModuleTypes {
  state: ViewModuleStateTypes,
  effects: {
    changeDisplayPage: Effect
  }
  reducers: {
    setCurrentImg: Reducer<CreateBookModelStateType>
    setZoomRation: Reducer<CreateBookModelStateType>
  }
}

export const ViewModule: ViewModuleTypes = {
  state: {
    currentImageName: '',
    zoomRatio: 0.5,
  },
  reducers: {
    setCurrentImg(state, { payload: { name } }) {
      return {
        ...state,
        currentImageName: name,
      };
    },
    setZoomRation(state, { payload: { ratio } }) {
      return {
        ...state,
        zoomRatio: ratio,
      };
    },
  },
  effects: {
    * changeDisplayPage({ payload }, { call, put, select }) {
      const { page }: { page: Page } = payload;
      // get page image meta
      yield put({
        type: 'readPageImageInfo',
        payload: {
          page,
        },
      });
      // set display image
      yield put({
        type: 'setCurrentImg',
        payload: {
          name: page.name,
        },
      });
    },
  },
};
