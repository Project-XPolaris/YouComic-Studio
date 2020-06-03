import { Directory, Effect, Page, Reducer, ScanModelStateType } from '@@/plugin-dva/connect';

export interface ListModuleStateTypes {
  directoryList: Directory[];
}

export interface ListModuleTypes {
  state: ListModuleStateTypes,
  effects: {}
  reducers: {
    setDirectoryList:Reducer<ScanModelStateType>
  }
}

export const ListModule: ListModuleTypes = {
  state: {
    directoryList: [],
  },
  effects: {},
  reducers: {
    setDirectoryList(state, { payload: { directoryList } }) {
      return {
        ...state,
        directoryList,
      };
    },
  },
};
