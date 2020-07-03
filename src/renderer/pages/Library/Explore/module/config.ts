import { Effect, ExploreLibraryModelStateType, Reducer } from '@@/plugin-dva/connect';
import { LibraryExportConfig, saveLibraryExportConfigFile } from '@/services/library';
import { readJSONFile } from '@/services/file';
import { nodePath } from '@/global';
import { devVars } from '@/development';
import uuid from 'uuid';

export interface ExportLibraryBook {
  cover: string,
  name: string,
  path: string,
  isSelect: boolean,
  tags: Array<{ name: string, type: string, uuid: string }>,
  uuid: string,
  pages: any[]
}

export interface ConfigModuleStateTypes {
  libraryPath: string,
  config: LibraryExportConfig
}

export interface ConfigModuleTypes {
  state: ConfigModuleStateTypes,
  effects: {
    readLibraryConfig: Effect,
    saveConfig: Effect
  },
  reducers: {
    setLibraryPath: Reducer<ExploreLibraryModelStateType>,
    setConfig: Reducer<ExploreLibraryModelStateType>
  }
}

export const ConfigModule: ConfigModuleTypes = {
  state: {
    libraryPath: '',
    config: undefined,
  },
  reducers: {
    setLibraryPath(state, { payload: { path } }) {
      return {
        ...state,
        libraryPath: path,
      };
    },
    setConfig(state, { payload: { config } }) {
      return {
        ...state,
        config,
      };
    },
  },
  effects: {
    * readLibraryConfig(_, { call, put, select }) {
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
        type: 'setConfig',
        payload: {
          config,
        },
      });
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
    * saveConfig(_, { call, put, select }) {
      const exploreLibraryState: ExploreLibraryModelStateType = yield select(state => state.exploreLibrary);
      const config = exploreLibraryState.config;
      config.books = exploreLibraryState.books.map(item => {
        const existedBook = config.books.find(configBook => configBook.uuid === item.uuid);
        if (existedBook !== undefined) {
          return {
            ...existedBook,
            ...item,
            cover: nodePath.basename(item.cover),
          };
        }
        return {
          ...item,
          cover: nodePath.basename(item.cover),
        };
      });
      yield call(saveLibraryExportConfigFile, {
        config,
        savePath: nodePath.join(exploreLibraryState.libraryPath, 'library_export.json'),
      });
    },
  },
};