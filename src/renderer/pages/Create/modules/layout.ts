import { CreateBookModelStateType, Effect, Page, Reducer } from '@@/plugin-dva/connect';

export interface LayoutModuleStateTypes {
  showPageCollection: boolean
  showToolbar: boolean
}

export interface LayoutModuleTypes {
  state: LayoutModuleStateTypes,
  effects: {}
  reducers: {
    switchPageCollection: Reducer<CreateBookModelStateType>
    switchToolbar: Reducer<CreateBookModelStateType>
  }
}

export const LayoutModule: LayoutModuleTypes = {
  state: {
    showPageCollection: false,
    showToolbar: false,
  },
  effects: {},
  reducers: {
    switchPageCollection(state, _) {
      return {
        ...state,
        showPageCollection: !state.showPageCollection,
      };
    },
    switchToolbar(state, _) {
      return {
        ...state,
        showToolbar: !state.showToolbar,
      };
    },
  },
};
