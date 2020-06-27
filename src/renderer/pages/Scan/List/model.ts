import { Effect } from 'dva';
import { Reducer } from 'redux';
import { MatchTextInfo } from '@/utils/match';
import { selectImageFile } from '@/services/file';
import { differenceWith } from 'lodash';
import { BookFilterModule, BookFilterModuleStateTypes, BookFilterModuleTypes } from '@/pages/Scan/List/modules/filter';
import { ScanModule, ScanModuleStateTypes, ScanModuleTypes } from '@/pages/Scan/List/modules/scanner';
import { UploadModule, UploadModuleStateTypes, UploadModuleTypes } from '@/pages/Scan/List/modules/upload';
import { ListModule, ListModuleStateTypes, ListModuleTypes } from '@/pages/Scan/List/modules/list';
import { LibraryModule, LibraryModuleStateTypes, LibraryModuleTypes } from '@/pages/Scan/List/modules/library';

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
  item: {
    visible: boolean
  }
}

export interface DirFilter {
  onFilter(directory: Directory): Boolean
}

export type ScanModelStateType =
  BaseScanModelStateType
  & ScanModuleStateTypes
  & BookFilterModuleStateTypes
  & UploadModuleStateTypes
  & ListModuleStateTypes
  & LibraryModuleStateTypes

interface BaseScanModelStateType {
  path?: string;

  quickViewDrawer: {
    isOpen: boolean;
    directory?: string;
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

  displayList: string[]
}

type ScanModelType = BaseScanModelType & ScanModuleTypes & BookFilterModuleTypes & UploadModuleTypes & ListModuleTypes & LibraryModuleTypes

export interface BaseScanModelType {
  namespace: string;
  reducers: {
    setPath: Reducer<ScanModelStateType>;
    setDirectoryList: Reducer<ScanModelStateType>;
    setState: Reducer<ScanModelStateType>;
    quickViewDirectory: Reducer<ScanModelStateType>;
    closeQuickViewDirectoryDrawer: Reducer<ScanModelStateType>;
    updateItemsValue: Reducer<ScanModelStateType>;
    setCoverPath: Reducer<ScanModelStateType>;
    setSelectedDirectory: Reducer<ScanModelStateType>;
    openCreateTagDialog: Reducer<ScanModelStateType>;
    closeCreateTagDialog: Reducer<ScanModelStateType>;
    createTag: Reducer<ScanModelStateType>;
    removeSelectDirectory: Reducer<ScanModelStateType>;
    setSelectedDirectoryCover: Reducer<ScanModelStateType>;
    setSelectTitle: Reducer<ScanModelStateType>;
    setDisplayDirPath: Reducer<ScanModelStateType>;
    setExistBook: Reducer
    setFilterDrawerVisible: Reducer

  };
  state: ScanModelStateType;
  effects: {
    selectItemCover: Effect;
  };
  subscriptions: {};
}

const ScanModel: ScanModelType = {
  namespace: 'scan',
  state: {
    ...ScanModule.state,
    ...BookFilterModule.state,
    ...UploadModule.state,
    ...ListModule.state,
    path: '',

    quickViewDrawer: {
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
    displayList: [],
  },
  subscriptions: {},
  effects: {
    ...ScanModule.effects,
    ...BookFilterModule.effects,
    ...UploadModule.effects,
    ...ListModule.effects,
    ...LibraryModule.effects,
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
    ...ScanModule.reducers,
    ...BookFilterModule.reducers,
    ...UploadModule.reducers,
    ...ListModule.reducers,
    ...LibraryModule.reducers,
    setState(state, { payload: { newState } }) {
      return {
        ...state,
        ...newState,
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

    setDisplayDirPath(state, { payload: { list } }) {
      return {
        ...state,
        displayList: list,
      };
    },
  },
};
export default ScanModel;
