import { Reducer } from 'redux';

export const DialogKeys = {
  ScanInputMultipleTitle: 'scan/inputMultipleTitle',
};

export interface DialogsModelStateType {
  activeDialogs: { [key: string]: boolean };
}

export interface DialogsModelType {
  namespace: string;
  reducers: {
    setDialogActive: Reducer<DialogsModelStateType>;
  };
  state: DialogsModelStateType;
  effects: {};
  subscriptions: {};
}

const DialogsModel: DialogsModelType = {
  namespace: 'dialogs',
  state: {
    activeDialogs: {},
  },
  subscriptions: {},
  effects: {},
  reducers: {
    setDialogActive(state, { payload: { key, isActive } }) {
      return {
        ...state,
        activeDialogs: {
          ...state.activeDialogs,
          [key]: isActive,
        },
      };
    },
  },
};
export default DialogsModel;
