import { Effect } from 'dva';
import { scanBookDirectory } from '@/services/scan';
import { Reducer } from 'redux';
import { matchTagInfo, MatchTextInfo } from '@/utils/match';
import { selectImageFile } from '@/services/file';
import { differenceWith, forOwn } from 'lodash';
import { fs, nodeFormData } from '@/global';
import { Book, ListQueryContainer, Tag as TagModel } from '@/services/youcomic/model';
import {
  addTagToBook,
  createNewBook,
  createTag,
  queryTags,
  uploadBookPage,
  uploadCover,
} from '@/services/youcomic/client';
import { HomeModelStateType } from '@/pages/Home/model';
import scan from '@/pages/Scan/List/compoennts/modules/scan';
import upload from '@/pages/Scan/List/compoennts/modules/upload';

export interface Directory {
  path: string;
  name: string;
  matchInfo: MatchTextInfo;
  targetFiles: Array<{
    path: string;
  }>;
  coverPath?: string;
  extraTags: Array<{ type: string; name: string }>;
  title?: string;
}

export interface ScanModelStateType {
  path?: string;
  directoryList: Directory[];
  scanningDialog: {
    isOpen: boolean;
  };
  quickViewDrawer: {
    isOpen: boolean;
    directory?: string;
  };
  scanOption: {
    isOpen: boolean;
  };
  selectedDirectory: string[];
  createTagDialog: {
    isOpen: boolean;
    action: string;
  };
  uploadDialog: {
    current?: Directory;
    currentProgress: number;
    currentInfo: string;
    totalCount: number;
    completeCount: number;
    totalProgress: number;
    isOpen: boolean;
  };
}

export interface ScanModelType {
  namespace: string;
  reducers: {
    setPath: Reducer<ScanModelStateType>;
    setScanningDialog: Reducer<ScanModelStateType>;
    updateScanningDialog: Reducer<ScanModelStateType>;
    setDirectoryList: Reducer<ScanModelStateType>;
    setState: Reducer<ScanModelStateType>;
    quickViewDirectory: Reducer<ScanModelStateType>;
    closeQuickViewDirectoryDrawer: Reducer<ScanModelStateType>;
    updateItemsValue: Reducer<ScanModelStateType>;
    setCoverPath: Reducer<ScanModelStateType>;
    openScanOptionDrawer: Reducer<ScanModelStateType>;
    closeScanOptionDrawer: Reducer<ScanModelStateType>;
    setSelectedDirectory: Reducer<ScanModelStateType>;
    openCreateTagDialog: Reducer<ScanModelStateType>;
    closeCreateTagDialog: Reducer<ScanModelStateType>;
    createTag: Reducer<ScanModelStateType>;
    removeSelectDirectory: Reducer<ScanModelStateType>;
    setSelectedDirectoryCover: Reducer<ScanModelStateType>;
    updateUploadDialog: Reducer<ScanModelStateType>;
    setSelectTitle: Reducer<ScanModelStateType>;
  };
  state: ScanModelStateType;
  effects: {
    scanBookDirectory: Effect;
    selectItemCover: Effect;
    uploadToYouComic: Effect;
  };
  subscriptions: {};
}

const ScanModel: ScanModelType = {
  namespace: 'scan',
  state: {
    path: '',
    directoryList: [],
    scanningDialog: {
      isOpen: false,
    },
    quickViewDrawer: {
      isOpen: false,
    },
    scanOption: {
      isOpen: false,
    },
    selectedDirectory: [],
    createTagDialog: {
      isOpen: false,
      action: '',
    },
    uploadDialog: {
      currentInfo: '',
      currentProgress: 0,
      totalCount: 0,
      completeCount: 0,
      totalProgress: 0,
      isOpen: false,
    },
  },
  subscriptions: {},
  effects: {
    ...scan.effects,
    ...upload.effects,
    * selectItemCover(_, { call, put, select }) {
      const scanState: ScanModelStateType = yield select(state => state.scan);

      const selectFiles: string[] = yield call(selectImageFile, {
        path: scanState.quickViewDrawer.directory,
      });
      if (selectFiles === undefined || selectFiles.length < 1) {
        return;
      }
      yield put({
        type: 'setCoverPath',
        payload: {
          path: selectFiles[0],
        },
      });
    },

  },
  reducers: {
    ...scan.reducers,
    ...upload.reducers,
    setState(state, { payload: { newState } }) {
      return {
        ...state,
        ...newState,
      };
    },
    setScanningDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        scanningDialog: dialog,
      };
    },

    quickViewDirectory(state, { payload: { directory } }) {
      return {
        ...state,
        quickViewDrawer: {
          isOpen: true,
          directory,
        },
      };
    },
    closeQuickViewDirectoryDrawer(state, {}) {
      return {
        ...state,
        quickViewDrawer: {
          isOpen: false,
          directory: undefined,
        },
      };
    },
    updateItemsValue(state, { payload: { key, newValue } }) {
      return {
        ...state,
        directoryList: state.directoryList.map(directoryItem => {
          if (directoryItem.path === state.quickViewDrawer.directory) {
            if (key === 'title') {
              return {
                ...directoryItem,
                title: newValue,
              };
            } else {
              return {
                ...directoryItem,
                matchInfo: {
                  ...directoryItem.matchInfo,
                  [key]: newValue,
                },
              };
            }
          }
          return directoryItem;
        }),
      };
    },
    setCoverPath(state, { payload: { path } }) {
      return {
        ...state,
        directoryList: state.directoryList.map(file => {
          if (file.path === state.quickViewDrawer.directory) {
            return { ...file, coverPath: path };
          }
          return file;
        }),
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
    setSelectedDirectory(state, { payload: { directoryList } }) {
      return {
        ...state,
        selectedDirectory: directoryList,
      };
    },
    openCreateTagDialog(state, { payload: { action } }) {
      return {
        ...state,
        createTagDialog: {
          ...state.createTagDialog,
          isOpen: true,
          action,
        },
      };
    },
    closeCreateTagDialog(state, _) {
      return {
        ...state,
        createTagDialog: {
          ...state.createTagDialog,
          isOpen: false,
        },
      };
    },
    createTag(state, { payload: { name, type } }) {
      if (state.createTagDialog.action === 'create') {
        return {
          ...state,
          directoryList: state.directoryList.map(file => {
            if (file.path === state.quickViewDrawer.directory) {
              return { ...file, extraTags: [...file.extraTags, { name, type }] };
            }
            return file;
          }),
          createTagDialog: {
            ...state.createTagDialog,
            isOpen: false,
          },
        };
      } else if (state.createTagDialog.action === 'multipleCreate') {
        return {
          ...state,
          createTagDialog: {
            ...state.createTagDialog,
            isOpen: false,
          },
          directoryList: state.directoryList.map(item => {
            if (
              state.selectedDirectory.find(selectedItem => selectedItem === item.path) !== undefined
            ) {
              // spec tag
              if (['artist', 'theme', 'series', 'translator'].findIndex(it => type === it) !== -1) {
                return {
                  ...item,
                  matchInfo: {
                    ...item.matchInfo,
                    [type]: name,
                  },
                };
              }
              return {
                ...item,
                extraTags: [...item.extraTags, { name, type }],
              };
            }
            return item;
          }),
        };
      }
      return {
        ...state,
      };
    },
    removeSelectDirectory(state, _) {
      return {
        ...state,
        directoryList: differenceWith(
          state.directoryList,
          state.selectedDirectory,
          (a, b) => a.path === b,
        ),
        selectedDirectory: [],
      };
    },
    setSelectedDirectoryCover(state, { payload: { type, index } }) {
      switch (type) {
        case 'index':
          return {
            ...state,
            directoryList: state.directoryList.map(dir => {
              if (
                dir.targetFiles.length > index &&
                state.selectedDirectory.find(path => path === dir.path) !== undefined
              ) {
                return {
                  ...dir,
                  coverPath: dir[index],
                };
              }
              return dir;
            }),
          };
        case 'last':
          return {
            ...state,
            directoryList: state.directoryList.map(dir => {
              if (
                dir.targetFiles.length - index >= 0 &&
                state.selectedDirectory.find(path => path === dir.path) !== undefined
              ) {
                return {
                  ...dir,
                  coverPath: dir[index],
                };
              }
            }),
          };
      }
    },

    setPath(state, { payload: { path } }) {
      return {
        ...state,
        path,
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
    setSelectTitle(state, { payload: { title } }) {
      return {
        ...state,
        directoryList: state.directoryList.map((dirItem, idx) => {
          if (state.selectedDirectory.find(selectDirPath => selectDirPath === dirItem.path)) {
            let dirTitle: string = title;
            if (title.includes('%index%')) {
              dirTitle = dirTitle.replace('%index%', String(idx + 1));
            }
            dirItem.title = dirTitle;
          }
          return dirItem;
        }),
      };
    },
  },
};
export default ScanModel;
