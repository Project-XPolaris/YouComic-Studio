import { Effect, ExploreLibraryModelStateType, ExploreLibraryModelType, Reducer } from '@@/plugin-dva/connect';
import { ExportLibraryBook } from '@/pages/Library/Explore/module/config';
import { LIBRARY_BOOK_QUICK_VIEW_KEY } from '@/pages/Library/Explore/parts/QuickView';

export interface UIModuleStateTypes {
  title: string,
  subtitle: string,
  quickViewBookPath: string
}

export interface UIModuleTypes {
  state: UIModuleStateTypes,
  effects: {
    quickView: Effect
  },
  reducers: {
    setTitle: Reducer<ExploreLibraryModelStateType>,
    setSubTitle: Reducer<ExploreLibraryModelStateType>,
    setQuickViewBookPath: Reducer<ExploreLibraryModelType>
  }
}

export const UIModule: UIModuleTypes = {
  state: {
    title: 'Unknown',
    subtitle: '',
    quickViewBookPath: '',
  },
  reducers: {
    setTitle(state, { payload: { title } }) {
      return {
        ...state,
        title,
      };
    },
    setSubTitle(state, { payload: { subtitle } }) {
      return {
        ...state,
        subtitle,
      };
    },
    setQuickViewBookPath(state, { payload: { path } }) {
      return {
        ...state,
        quickViewBookPath: path,
      };
    },

  },
  effects: {
    * quickView({ payload: { book } }, { put }) {
      yield put({
        type: 'setQuickViewBookPath',
        payload: {
          path: book.path,
        },
      });
      yield put({
        type: 'dialogs/setDialogActive',
        payload: {
          key: LIBRARY_BOOK_QUICK_VIEW_KEY,
          isActive: true,
        },
      });
    },
  },
};