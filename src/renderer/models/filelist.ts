import { Effect } from 'dva';
import { Reducer } from 'redux';
import { HomeModelStateType } from '@/pages/Home/model';
import { ChildrenItem } from '@/pages/List/components/SideTree';
import { directoryTree } from '@/global';

export interface FileListModelStateType {
  tree?: any;
  directoryMapping: { [key: string]: ChildrenItem };
}

export interface FileListModelType {
  namespace: string;
  reducers: {
    setFileTree: Reducer<FileListModelStateType>;
    setDirectoryMapping: Reducer<FileListModelStateType>;
  };
  state: FileListModelStateType;
  effects: {
    listFolder: Effect;
  };
  subscriptions: {};
}

const FileListModel: FileListModelType = {
  namespace: 'fileList',
  state: {
    directoryMapping: {},
  },
  subscriptions: {},
  effects: {
    *listFolder(_, { call, put, select }) {
      const homeState: HomeModelStateType = yield select(state => state.home);
      const tree = directoryTree(homeState.path);
      yield put({
        type: 'setFileTree',
        payload: {
          tree,
        },
      });
      const walkQueue: ChildrenItem[] = tree.children;
      const dirMapping = {};
      while (walkQueue.length !== 0) {
        const node = walkQueue.shift();
        if (node.type === 'directory') {
          dirMapping[node.path] = node;
        }
      }
      yield put({
        type: 'setDirectoryMapping',
        payload: {
          mapping: dirMapping,
        },
      });
    },
  },
  reducers: {
    setFileTree(state, { payload: { tree } }) {
      return {
        ...state,
        tree,
      };
    },
    setDirectoryMapping(state, { payload: { mapping } }) {
      return {
        ...state,
        directoryMapping: mapping,
      };
    },
  },
};
export default FileListModel;
