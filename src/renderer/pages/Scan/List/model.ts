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

export interface Directory {
  path: string
  name: string
  matchInfo: MatchTextInfo,
  targetFiles: Array<{
    path: string
  }>
  coverPath?: string
  extraTags: Array<{ type: string, name: string }>
}

export interface ScanModelStateType {
  path?: string
  directoryList: Directory[]
  scanningDialog: {
    isOpen: boolean
  }
  quickViewDrawer: {
    isOpen: boolean
    directory?: string
  }
  scanOption: {
    isOpen: boolean
  }
  selectedDirectory: string[]
  createTagDialog: {
    isOpen: boolean
    action: string
  }
  uploadDialog: {
    current?: Directory
    currentProgress: number
    currentInfo: string
    totalCount: number
    completeCount: number
    totalProgress: number
    isOpen: boolean
  }
}

export interface ScanModelType {
  namespace: string,
  reducers: {
    setPath: Reducer<ScanModelStateType>
    setScanningDialog: Reducer<ScanModelStateType>
    updateScanningDialog: Reducer<ScanModelStateType>
    setDirectoryList: Reducer<ScanModelStateType>
    setState: Reducer<ScanModelStateType>
    quickViewDirectory: Reducer<ScanModelStateType>
    closeQuickViewDirectoryDrawer: Reducer<ScanModelStateType>
    updateItemsValue: Reducer<ScanModelStateType>
    setCoverPath: Reducer<ScanModelStateType>
    openScanOptionDrawer: Reducer<ScanModelStateType>
    closeScanOptionDrawer: Reducer<ScanModelStateType>
    setSelectedDirectory: Reducer<ScanModelStateType>
    openCreateTagDialog: Reducer<ScanModelStateType>
    closeCreateTagDialog: Reducer<ScanModelStateType>
    createTag: Reducer<ScanModelStateType>
    removeSelectDirectory: Reducer<ScanModelStateType>
    setSelectedDirectoryCover: Reducer<ScanModelStateType>
    updateUploadDialog: Reducer<ScanModelStateType>
  }
  state: ScanModelStateType
  effects: {
    scanBookDirectory: Effect
    selectItemCover: Effect
    uploadToYouComic: Effect
  }
  subscriptions: {}
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
    * scanBookDirectory(state, { call, put, select }) {
      const scanState: ScanModelStateType = yield select(state => (state.scan));
      const homeState: HomeModelStateType = yield select(state => (state.home));
      const directoryList: Directory[] = yield call(scanBookDirectory, { path: homeState.path });

      directoryList.forEach((dir: Directory) => {
        dir.matchInfo = matchTagInfo(dir.name);
        dir.coverPath = dir.targetFiles[0].path;
        dir.extraTags = [];
      });
      yield put({
        type: 'setDirectoryList',
        payload: {
          directoryList,
        },
      });
    },
    * selectItemCover(_, { call, put, select }) {
      const scanState: ScanModelStateType = yield select(state => (state.scan));

      const selectFiles: string[] = yield call(selectImageFile, { path: scanState.quickViewDrawer.directory });
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
    * uploadToYouComic(_, { call, put, select }) {
      const scanState: ScanModelStateType = yield select(state => (state.scan));
      yield put({
        type: 'updateUploadDialog',
        payload: {
          dialog: {
            totalCount: scanState.directoryList.length,
            totalProgress: 0,
          },
        },
      });
      for (let idx = 0; idx < scanState.directoryList.length; idx++) {
        const dir = scanState.directoryList[idx];
        const progressTotal = 4;
        yield put({
          type: 'updateUploadDialog',
          payload: {
            dialog: {
              isOpen: true,
              current: dir,
              currentProgress: 0,
              currentInfo: '创建书籍',
              completeCount: idx,
              totalProgress: Math.ceil((idx / scanState.directoryList.length) * 100),
            },
          },
        });
        // create book
        const book: Book = yield call(createNewBook, { name: dir.matchInfo.title });
        // create tags
        yield put({
          type: 'updateUploadDialog',
          payload: {
            dialog: {
              currentProgress: Math.ceil((1 / progressTotal) * 100),
              currentInfo: '添加标签',
            },
          },
        });
        const tags = [];
        forOwn(dir.matchInfo, (value, key) => {
          if (key === 'title') {
            return;
          }
          tags.push({ name: value, type: key });
        });
        // query exists tag
        const queryExistTagResponse: ListQueryContainer<TagModel> = yield call(queryTags, {
          queryParams: {
            name: tags.map(tag => (tag.name)),
            page: 1,
            pageSize: tags.length,
          },
        });
        const tagToCreate = differenceWith(tags, queryExistTagResponse.result, (a, b) => a.name === b.name);
        const tagToAdd = queryExistTagResponse.result;
        // create tag
        for (const tagToCreateElement of tagToCreate) {
          const createTagResponse: TagModel = yield call(createTag, {
            name: tagToCreateElement.name,
            type: tagToCreateElement.type,
          });
          tagToAdd.push(createTagResponse);
        }

        const tagIds = tagToAdd.map(tag => tag.id);
        yield call(addTagToBook, { bookId: book.id, tags: tagIds });

        // upload cover
        yield put({
          type: 'updateUploadDialog',
          payload: {
            dialog: {
              currentProgress: Math.ceil((2 / progressTotal) * 100),
              currentInfo: '上传封面',
            },
          },
        });
        const uploadCoverForm = new nodeFormData();
        uploadCoverForm.append('image', fs.createReadStream(dir.coverPath));
        yield call(uploadCover, { form: uploadCoverForm, bookId: book.id });

        // upload page
        yield put({
          type: 'updateUploadDialog',
          payload: {
            dialog: {
              currentProgress: Math.ceil((3 / progressTotal) * 100),
              currentInfo: '上传页面',
            },
          },
        });
        const uploadPageForm = new nodeFormData();
        dir.targetFiles.forEach((file, idx) => {
          uploadPageForm.append(`page_${idx + 1}`, fs.createReadStream(file.path));
        });
        yield call(uploadBookPage, { bookId: book.id, form: uploadPageForm });

      }
      yield put({
        type: 'updateUploadDialog',
        payload: {
          dialog: {
            isOpen: false,
          },
        },
      });

    },
  },
  reducers: {
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
    setDirectoryList(state, { payload: { directoryList } }) {
      return {
        ...state,
        directoryList,
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
            return {
              ...directoryItem,
              [key]: newValue,
            };
          }
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
            if (state.selectedDirectory.find(selectedItem => selectedItem === item.path) !== undefined) {
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
        directoryList: differenceWith(state.directoryList, state.selectedDirectory, (a, b) => a.path === b),
        selectedDirectory: [],
      };
    },
    setSelectedDirectoryCover(state, { payload: { type, index } }) {
      switch (type) {
        case 'index':
          return {
            ...state,
            directoryList: state.directoryList.map(dir => {
              if (dir.targetFiles.length > index && state.selectedDirectory.find(path => path === dir.path) !== undefined) {
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
              if (dir.targetFiles.length - index >= 0 && state.selectedDirectory.find(path => path === dir.path) !== undefined) {
                return {
                  ...dir,
                  coverPath: dir[index],
                };
              }
            }),
          };
      }
    },
    updateUploadDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        uploadDialog: {
          ...state.uploadDialog,
          ...dialog,
        },
      };
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
  },

};
export default ScanModel;
