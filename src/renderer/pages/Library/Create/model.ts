import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';
import { showSelectFolderDialog } from '@/services/file';
import { message } from 'antd';
import { devVars } from '@/development';
import { CreateLibraryScanDialogKey } from '@/pages/Library/Create/SelectPath';
import { scanBookDirectory } from '@/services/scan';
import { Directory } from '@/pages/Scan/List/model';
import { path, slash } from '@/global';
import { matchTagInfo } from '@/utils/match';
import { LibraryExportConfig, saveLibraryExportConfigFile } from '@/services/library';

export interface CreateLibraryModelStateType {
  buildPath: string
}

export interface CreateLibraryModelType {
  namespace: string,
  reducers: {
    setBuildPath: Reducer<CreateLibraryModelStateType>
  }
  state: CreateLibraryModelStateType
  effects: {
    selectPath: Effect
    selectPathNext: Effect
    scanLibrary: Effect
    buildLibrary: Effect
  }
  subscriptions: {}
}

const CreateLibraryModel: CreateLibraryModelType = {
  namespace: 'createLibrary',
  state: {
    buildPath: "",
  },
  subscriptions: {},
  effects: {
    * selectPath({}, { call, put, select }) {
      const selectDirs: string[] = yield call(showSelectFolderDialog, {});
      if (selectDirs === undefined || selectDirs.length === 0) {
        message.warn('未选择路径');
      }
      yield put({ type: 'setBuildPath', payload: { path: selectDirs[0] } });
    },
    * selectPathNext({}, { call, put, select }) {
      const createLibraryState: CreateLibraryModelStateType = yield select(state => state.createLibrary);
      if (createLibraryState.buildPath.length === 0 && !devVars.enable) {
        message.error('未选择路径');
        return;
      }
      yield put({ type: 'scanLibrary' });
    },
    * scanLibrary(_, { call, put, select }) {
      const createLibraryState: CreateLibraryModelStateType = yield select(state => state.createLibrary);
      let scanPath: string = createLibraryState.buildPath;
      // for development
      if (createLibraryState.buildPath === '' && devVars.enable && devVars.createLibraryScan !== undefined) {
        scanPath = devVars.createLibraryScan;
      }
      yield put({ type: 'dialogs/setDialogActive', payload: { key: CreateLibraryScanDialogKey, isActive: true } });
      const result: Directory[] = yield call(scanBookDirectory, { path: scanPath });
      yield put({ type: 'buildLibrary', payload: { dirs: result } });
    },
    * buildLibrary({ payload: { dirs } }: { payload: { dirs: Directory[] } }, { call, put, select }) {
      const createLibraryState: CreateLibraryModelStateType = yield select(state => state.createLibrary);
      // match tag
      dirs.forEach((item: Directory) => {
        const matchInfo = matchTagInfo(item.name);
        item.matchInfo = matchInfo;
        if (matchInfo.title) {
          item.title = matchInfo.title;
        }
      });

      const config: LibraryExportConfig = {
        name: path.basename(createLibraryState.buildPath),
        books: dirs.filter(item => item.matchInfo !== null && item.title && item.title !== '').map((item: Directory) => {
          const sortedTargetFile = item.targetFiles.sort((a, b) => path.basename(a.path) > path.basename(b.path) ? 1 : -1);
          return {
            name: item.title,
            path: slash(item.path.replace(createLibraryState.buildPath, '')),
            tags: Object.getOwnPropertyNames(item.matchInfo)
              .filter(key => key !== 'title')
              .map(key => {
                return { type: key, name: item.matchInfo[key] };
              }),
            pages: sortedTargetFile.map((pageFile, idx) => {
              return {
                path: slash(pageFile.path.replace(item.path, '')),
                order: idx,
              };
            }),
            cover: slash(sortedTargetFile[0].path.replace(item.path, '')),
          };
        }),
      };
      yield call(saveLibraryExportConfigFile, {
        config,
        savePath: path.join(createLibraryState.buildPath, 'library_export.json'),
      });
      yield put({
        type: 'dialogs/setDialogActive',
        payload: {
          key: CreateLibraryScanDialogKey,
          isActive: false,
        },
      });
      message.success("转换为Library成功")
    },
  },
  reducers: {
    setBuildPath(state, { payload: { path } }) {
      return {
        ...state,
        buildPath: path,
      };
    },
  },
};
export default CreateLibraryModel;
