import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

export interface DirectoryHomeStateType {
}

export interface DirectoryHomeType {
  namespace: string,
  reducers: {}
  state: DirectoryHomeStateType
  effects: {}
  subscriptions: {}
}

const DirectoryHome: DirectoryHomeType = {
  namespace: 'directoryHome',
  state: {},
  subscriptions: {},
  effects: {},
  reducers: {},

};
export default DirectoryHome;
