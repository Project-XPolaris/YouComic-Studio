import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';
import { User, UserAuth } from '@/services/youcomic/model';
import { login, queryUser } from '@/services/youcomic/client';
import { ApplicationConfig } from '@/config';

export interface UserModelStateType {
  loginDialog: {
    isOpen: boolean
  },
  current?:User
}

export interface UserModelType {
  namespace: string,
  reducers: {
    showLoginDialog: Reducer<UserModelStateType>
    closeLoginDialog: Reducer<UserModelStateType>
    setUser: Reducer<UserModelStateType>
  }
  state: UserModelStateType
  effects: {
    login: Effect
    refresh: Effect
    logout:Effect
  }
  subscriptions: {
    setup:Subscription
  }
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    loginDialog: {
      isOpen: false,
    },

  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({
        type:"refresh"
      })
    }
  },
  effects: {
    * login({ payload: { username, password } }, { call, put, select }) {
      const auth: UserAuth = yield call(login, { username, password });
      localStorage.setItem(ApplicationConfig.AUTH_USER_ID_KEY, String(auth.id));
      localStorage.setItem(ApplicationConfig.AUTH_USER_TOKEN_KEY, auth.sign);
      yield put({
        type:"refresh"
      })
      yield put({
        type: 'closeLoginDialog',
      });
    },
    * refresh({}, { call, put, select }) {
      const userId = localStorage.getItem(ApplicationConfig.AUTH_USER_ID_KEY);
      if (userId == null) {
        return;
      }
      try{
        const user: User = yield call(queryUser, { id: userId });
        yield put({
          type:"setUser",
          payload:{
            user
          }
        })
      }catch (e) {
        console.log("fetch user error")
      }

    },
    *logout({},{call,put,select}){
      localStorage.removeItem(ApplicationConfig.AUTH_USER_ID_KEY)
      localStorage.removeItem(ApplicationConfig.AUTH_USER_TOKEN_KEY)
      yield put({
        type:"setUser",
        payload:{
          user:undefined
        }
      })
    }
  },
  reducers: {
    showLoginDialog(state, {}) {
      return {
        ...state,
        loginDialog: {
          ...state.loginDialog,
          isOpen: true,
        },
      };
    },
    closeLoginDialog(state, {}) {
      return {
        ...state,
        loginDialog: {
          ...state.loginDialog,
          isOpen: false,
        },
      };
    },
    setUser(state,{payload:{user}}){
      return {
        ...state,
        current:user
      }
    }
  },

};
export default UserModel;
