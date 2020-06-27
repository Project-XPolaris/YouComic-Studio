import { Directory, Effect, HomeModelStateType, Page, Reducer, ScanModelStateType } from '@@/plugin-dva/connect';
import { scanBookDirectory } from '@/services/scan';
import { matchTagInfo } from '@/utils/match';
import { queryBooks } from '@/services/youcomic/client';
import { Book } from '@/services/youcomic/model';
import { devVars } from '@/development';
import { nodePath } from '@/global';

export interface ScanModuleStateTypes {
  scanOption: {
    isOpen: boolean;
  };
  scanningDialog: {
    isOpen: boolean;
  };
  existBook: Book[]
}

export interface ScanModuleTypes {
  state: ScanModuleStateTypes,
  effects: {
    scanBookDirectory: Effect;
    queryExistBook: Effect
  }
  reducers: {
    setScanningDialog: Reducer<ScanModelStateType>;
    updateScanningDialog: Reducer<ScanModelStateType>;
    openScanOptionDrawer: Reducer<ScanModelStateType>;
    closeScanOptionDrawer: Reducer<ScanModelStateType>;
    onScanComplete: Reducer<ScanModelStateType>;
    setExistBook: Reducer<ScanModelStateType>;
  }
}

export const ScanModule: ScanModuleTypes = {
  state: {
    scanOption: {
      isOpen: false,
    },
    scanningDialog: {
      isOpen: false,
    },
    existBook: [],
  },
  effects: {
    * scanBookDirectory(state, { call, put, select }) {
      yield put({
        type: 'setScanningDialog',
        payload: {
          dialog: {
            isOpen: true,
          },
        },
      });
      const homeState: HomeModelStateType = yield select(state => state.home);
      let scanPath = homeState.path;
      if (devVars.enable && devVars['scanPath'] !== undefined) {
        scanPath = devVars['scanPath'];
      }
      const directoryList: Directory[] = yield call(scanBookDirectory, { path: scanPath });
      directoryList.forEach((dir: Directory) => {
        const matchResult = matchTagInfo(dir.name);
        dir.targetFiles.sort((a, b) => nodePath.basename(a.path) > nodePath.basename(b.path) ? 1 : -1);
        dir.matchInfo = matchResult;
        dir.coverPath = dir.targetFiles[0].path;
        dir.extraTags = [];
        dir.title = matchResult.title;
        dir.item = {
          visible: true,
        };
      });
      const currentUser = yield select(state => (state.user.current));
      if (currentUser) {
        const bookTitleParams =
          directoryList
            .filter((dir: Directory) => dir.title !== undefined && dir.title.length !== 0)
            .map((dir: Directory) => dir.title);
        yield put({
          type: 'queryExistBook',
          payload: {
            bookTitleParams,
          },
        });
      }
      yield put({
        type: 'onScanComplete',
        payload: {
          directoryList,
        },
      });
      yield put({
        type: 'setScanningDialog',
        payload: {
          dialog: {
            isOpen: false,
          },
        },
      });
    },
    * queryExistBook({ payload: { bookTitleParams } }, { call, put, select }) {
      const response = yield call(queryBooks, {
        page: 1,
        page_size: bookTitleParams.length,
        name: bookTitleParams,
      });
      yield put({
        type: 'setExistBook',
        payload: {
          list: response.result,
        },
      });
    },
  },
  reducers: {
    onScanComplete(state, { payload: { directoryList } }): ScanModelStateType {
      return {
        ...state,
        directoryList,
        displayList: directoryList.map((item) => item.path),
      };
    },
    setExistBook(state: ScanModelStateType, { payload: { list } }): ScanModelStateType {
      return {
        ...state,
        existBook: list,
      };
    },
    openScanOptionDrawer(state, {}) {
      return {
        ...state,
        scanOption: {
          ...state.scanOption,
          isOpen: true,
        },
      };
    },
    closeScanOptionDrawer(state, {}) {
      return {
        ...state,
        scanOption: {
          ...state.scanOption,
          isOpen: false,
        },
      };
    },
    updateScanningDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        scanningDialog: {
          ...state.scanningDialog,
          ...dialog,
        },
      };
    },
    setScanningDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        scanningDialog: dialog,
      };
    },
  },
};
