import { Effect, ExploreLibraryModelStateType, Reducer } from '@@/plugin-dva/connect';
import { LibraryExportConfig } from '@/services/library';
import { readJSONFile } from '@/services/file';
import { nodePath } from '@/global';
import { devVars } from '@/development';

export interface ExportLibraryBook {
  cover: string,
  name: string,
  path: string,
  isSelect: boolean
}

export interface ConfigModuleStateTypes {
  libraryPath: string
}

export interface ConfigModuleTypes {
  state: ConfigModuleStateTypes,
  effects: {
    readLibraryConfig: Effect
  },
  reducers: {
    setLibraryPath: Reducer<ExploreLibraryModelStateType>
  }
}

export const ConfigModule: ConfigModuleTypes = {
  state: {
    libraryPath: '',
  },
  reducers: {
    setLibraryPath(state, { payload: { path } }) {
      return {
        ...state,
        libraryPath: path,
      };
    },
  },
  effects: {
    * readLibraryConfig(S_, { call, put, select }) {
      let { exploreLibraryPath } = yield select(state => state.home);
      if ((exploreLibraryPath === undefined || exploreLibraryPath.length === 0) && devVars.enable) {
        exploreLibraryPath = devVars['exploreLibraryPath'];
      }
      yield put({
        type: 'setLibraryPath',
        payload: {
          path: exploreLibraryPath,
        },
      });
      const config: LibraryExportConfig = yield call(readJSONFile, { filepath: nodePath.join(exploreLibraryPath, 'library_export.json') });
      yield put({
        type: 'setTitle',
        payload: {
          title: config.name,
        },
      });
      yield put({
        type: 'setSubTitle',
        payload: {
          subtitle: exploreLibraryPath,
        },
      });
      console.log(config);

      // load books
      const books: Array<ExportLibraryBook & any> = config.books;
      books.forEach(item => {
        item.cover = nodePath.join(exploreLibraryPath, item.path, item.cover);
        item.isSelect = false;
      });
      yield put({
        type: 'setBooks',
        payload: {
          books,
        },
      });
    },
  },
};