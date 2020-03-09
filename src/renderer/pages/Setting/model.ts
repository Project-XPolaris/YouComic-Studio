import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';
import { ApplicationSettingOptions, Option } from '@/pages/Setting/settings';


export interface SettingModelStateType {
  options: Option[]
}

export interface SettingModelType {
  namespace: string,
  reducers: {
    changeOption: Reducer<SettingModelStateType>
  }
  state: SettingModelStateType
  effects: {
    loadSetting: Effect
    applyOption: Effect
  }
  subscriptions: {
    setup: Subscription
  }
}


const SettingModel: SettingModelType = {
  namespace: 'setting',
  state: {
    options: ApplicationSettingOptions,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting') {
          dispatch({
            type: 'loadSetting',
          });
        }
      });
    },
  },
  effects: {
    * loadSetting(_, { call, put, select }) {
      const settingState: SettingModelStateType = yield select(state => (state.setting));
      for (let option of settingState.options) {
        option.value = option.read();
      }
    },
    * applyOption(_, { call, put, select }) {
      const settingState: SettingModelStateType = yield select(state => (state.setting));
      for (let option of settingState.options) {
        yield call(option.save,{value:option.value});
      }
    },
  },
  reducers: {
    changeOption(state, { payload: { key, value } }) {
      return {
        ...state,
        options: [
          ...state.options.map(option => {
            if (option.key === key) {
              return {
                ...option,
                value,
              };
            }
            return option;
          }),
        ],
      };
    },
  },

};
export default SettingModel;
