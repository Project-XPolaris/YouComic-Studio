import { Reducer } from 'redux';

export interface DirectoryModelStateType {
  path?: string;
}

export interface DirectoryModelType {
  namespace: string;
  reducers: {
    setPath: Reducer<DirectoryModelStateType>;
  };
  state: DirectoryModelStateType;
  effects: {};
  subscriptions: {};
}

const DirectoryModel: DirectoryModelType = {
  namespace: 'directory',
  state: {},
  subscriptions: {},
  effects: {},
  reducers: {
    setPath(state, { payload: { path } }) {
      return {
        ...state,
        path,
      };
    },
  },
};
export default DirectoryModel;
