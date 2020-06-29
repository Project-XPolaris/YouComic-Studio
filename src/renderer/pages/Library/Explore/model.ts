import { Effect } from 'dva';
import { Subscription } from '@@/plugin-dva/connect';
import { ConfigModule, ConfigModuleStateTypes, ConfigModuleTypes } from '@/pages/Library/Explore/module/config';
import { notification } from 'antd';
import { UIModule, UIModuleStateTypes, UIModuleTypes } from '@/pages/Library/Explore/module/ui';
import { BookModule, BookModuleStateTypes, BookModuleTypes } from '@/pages/Library/Explore/module/book';

export interface BaseExploreLibraryModelStateType {

}

export type ExploreLibraryModelStateType =
  BaseExploreLibraryModelStateType
  & UIModuleStateTypes
  & ConfigModuleStateTypes
  & BookModuleStateTypes

export interface ExploreLibraryModelType {
  namespace: string,
  reducers: {},
  state: ExploreLibraryModelStateType,
  effects: {
    init: Effect
  },
  subscriptions: {
    setup: Subscription
  }
}

const CreateLibraryModel: ExploreLibraryModelType & ConfigModuleTypes & UIModuleTypes & BookModuleTypes = {
  namespace: 'exploreLibrary',
  state: {
    ...UIModule.state,
    ...ConfigModule.state,
    ...BookModule.state,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/library/explore') {
          dispatch({
            type: 'init',
          });
        }
      });
    },
  },
  effects: {
    ...ConfigModule.effects,
    ...UIModule.effects,
    ...BookModule.effects,
    * init(_, { call, put, select }) {
      yield put({
        type: 'readLibraryConfig',
      });
      notification['success']({
        message: '读取Media Library',
        description:
          '已读取数据',
      });
    },
  },
  reducers: {
    ...ConfigModule.reducers,
    ...UIModule.reducers,
    ...BookModule.reducers,
  },
};
export default CreateLibraryModel;