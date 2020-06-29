import { Effect } from 'dva';
import { Reducer } from 'redux';

import { checkIsValidateLibrary, listDirectoryFiles, showSelectFolderDialog, writeFile } from '@/services/file';
import { history } from 'umi';
import { path } from '@/global';
import { ProjectConfig } from '@/pages/Create/model';
import { message, notification } from 'antd';

export interface HomeModelStateType {
  path: string;
  loadingDialog: {
    isOpen: boolean;
  };
  editorPath?: string;
  createDialog: {
    isOpen: boolean;
    path: string;
  };
  exploreLibraryPath: string
}

export interface HomeModelType {
  namespace: string;
  reducers: {
    setPath: Reducer<HomeModelStateType>;
    setLoadingDirectoryDialog: Reducer<HomeModelStateType>;
    setCreateNewDialog: Reducer<HomeModelStateType>;
    setCreateNewPath: Reducer<HomeModelStateType>;
    openCreateNewProjectDialog: Reducer<HomeModelStateType>;
    closeCreateNewProjectDialog: Reducer<HomeModelStateType>;
    setEditPath: Reducer<HomeModelStateType>;
    setExploreLibraryPath: Reducer<HomeModelStateType>;
  };
  state: HomeModelStateType;
  effects: {
    selectFolder: Effect;
    toNext: Effect;
    onScanFolder: Effect;
    createNew: Effect;
    selectNewProjectSaveLocation: Effect;
    openExistProject: Effect;
    selectExploreLibrary: Effect
  };
  subscriptions: {};
}

const HomeModel: HomeModelType = {
  namespace: 'home',
  state: {
    path: '',
    loadingDialog: {
      isOpen: false,
    },
    createDialog: {
      isOpen: false,
      path: '',
    },
    editorPath: '',
  },
  subscriptions: {},
  effects: {
    * selectFolder(_, { put }) {
      const path = showSelectFolderDialog()[0];
      yield put({
        type: 'setPath',
        payload: {
          path,
        },
      });
    },
    * toNext(_, { put }) {
      yield put({
        type: 'setLoadingDirectoryDialog',
        payload: {
          dialog: {
            isOpen: true,
          },
        },
      });
      yield put({
        type: 'fileList/listFolder',
      });
      yield put({
        type: 'setLoadingDirectoryDialog',
        payload: {
          dialog: {
            isOpen: false,
          },
        },
      });
      history.push('/file/directory/home');
    },
    * onScanFolder(_, { put }) {
      const dirPaths = showSelectFolderDialog();
      if (!Boolean(dirPaths)) {
        return;
      }
      yield put({
        type: 'setPath',
        payload: {
          path: dirPaths[0],
        },
      });
      history.push('/scan/list');
    },
    * createNew(_, { call, put, select }) {
      const homeState: HomeModelStateType = yield select(state => state.home);
      const projectPath = homeState.createDialog.path;
      if (projectPath.length === 0) {
        return;
      }
      // check directory weather it is empty
      const fileList = yield call(listDirectoryFiles, { path: projectPath });
      if (fileList.length > 0) {
        message.error('请选择一个空文件夹');
        return;
      }

      const configFilePath = path.join(projectPath, 'project.json');
      const projectConfig: ProjectConfig = {
        pages: [],
      };
      yield call(writeFile, { data: JSON.stringify(projectConfig), path: configFilePath });
      yield put({ type: 'setEditPath', payload: { path: projectPath } });
      yield put({ type: 'closeCreateNewProjectDialog' });
      history.push('/book/create');
    },
    * selectNewProjectSaveLocation({}, { put }) {
      const dirPaths = showSelectFolderDialog();
      if (!Boolean(dirPaths)) {
        return;
      }
      yield put({
        type: 'setCreateNewPath',
        payload: {
          path: dirPaths[0],
        },
      });
    },
    * openExistProject({}, { call, put }) {
      const dirPaths = showSelectFolderDialog();
      if (!Boolean(dirPaths)) {
        return;
      }
      const path = dirPaths[0];
      const files: string[] = yield call(listDirectoryFiles, { path });
      if (files.find(filename => filename === 'project.json') !== undefined) {
        yield put({
          type: 'setEditPath',
          payload: {
            path,
          },
        });
        history.push('/book/create');
      } else {
        message.error('当前目录不是有效的项目目录');
      }
    },
    * selectExploreLibrary(_, { call, put, select }) {
      const dirPaths = showSelectFolderDialog();
      if (!Boolean(dirPaths)) {
        return;
      }
      const path = dirPaths[0];
      const isValidate = yield call(checkIsValidateLibrary, { libraryPath: path });
      if (!isValidate) {
        notification['error']({
          message: '错误',
          description:
            '该文件夹不是有效的MediaLibrary目录',
        });
        return;
      }

      yield put({
        type: 'setExploreLibraryPath',
        payload: {
          path,
        },
      });
      history.push('/library/explore');
    },
  },
  reducers: {
    setPath(state: HomeModelStateType, { payload: { path } }) {
      return {
        ...state,
        path,
      };
    },
    setLoadingDirectoryDialog(state, { payload: { dialog } }): HomeModelStateType {
      return {
        ...state,
        loadingDialog: dialog,
      };
    },
    setCreateNewDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        createDialog: dialog,
      };
    },
    setCreateNewPath(state, { payload: { path } }) {
      return {
        ...state,
        createDialog: {
          ...state.createDialog,
          path,
        },
      };
    },
    openCreateNewProjectDialog(state, {}) {
      return {
        ...state,
        createDialog: {
          ...state.createDialog,
          isOpen: true,
        },
      };
    },
    closeCreateNewProjectDialog(state, {}) {
      return {
        ...state,
        createDialog: {
          ...state.createDialog,
          isOpen: false,
        },
      };
    },
    setEditPath(state, { payload: { path } }) {
      return {
        ...state,
        editorPath: path,
      };
    },
    setExploreLibraryPath(state, { payload: { path } }) {
      return {
        ...state,
        exploreLibraryPath: path,
      };
    },
  },
};
export default HomeModel;
