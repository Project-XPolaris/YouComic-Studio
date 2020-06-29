import { ExploreLibraryModelStateType, Reducer } from '@@/plugin-dva/connect';

export interface UIModuleStateTypes {
  title: string,
  subtitle: string
}

export interface UIModuleTypes {
  state: UIModuleStateTypes,
  effects: {},
  reducers: {
    setTitle: Reducer<ExploreLibraryModelStateType>,
    setSubTitle: Reducer<ExploreLibraryModelStateType>
  }
}

export const UIModule: UIModuleTypes = {
  state: {
    title: 'Unknown',
    subtitle: '',
  },
  reducers: {
    setTitle(state, { payload: { title } }) {
      return {
        ...state,
        title,
      };
    },
    setSubTitle(state, { payload: { subtitle } }) {
      return {
        ...state,
        subtitle,
      };
    },
  },
  effects: {},
};