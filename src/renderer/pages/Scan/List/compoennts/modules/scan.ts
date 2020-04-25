import { HomeModelStateType } from '@/pages/Home/model';
import { scanBookDirectory } from '@/services/scan';
import { matchTagInfo } from '@/utils/match';
import { Directory, ScanModelStateType } from '@/pages/Scan/List/model';
import { queryBooks } from '@/services/youcomic/client';

export default {
  effects: {
    * scanBookDirectory(state, { call, put, select }) {
      yield put({
        type: 'setScanningDialog',
        payload: {
          dialog: {
            isOpen: true,
          },
        },
      });
      const homeState: HomeModelStateType = yield select(state => state.home);
      const directoryList: Directory[] = yield call(scanBookDirectory, { path: homeState.path });
      directoryList.forEach((dir: Directory) => {
        const matchResult = matchTagInfo(dir.name);
        dir.matchInfo = matchResult;
        dir.coverPath = dir.targetFiles[0].path;
        dir.extraTags = [];
        dir.title = matchResult.title;
      });
      const currentUser = yield select(state => (state.user.current))
      if (currentUser){
        const bookTitleParams =
          directoryList
            .filter((dir: Directory) => dir.title !== undefined && dir.title.length !== 0)
            .map((dir: Directory) => dir.title);
        yield put({
          type:"queryExistBook",
          payload:{
            bookTitleParams
          }
        })
      }
      yield put({
        type: 'onScanComplete',
        payload: {
          directoryList,
        },
      });
      yield put({
        type: 'setScanningDialog',
        payload: {
          dialog: {
            isOpen: false,
          },
        },
      });
    },
    * queryExistBook({ payload:{bookTitleParams} }, { call, put, select }){
      const response = yield call(queryBooks, {
        page: 1,
        page_size: bookTitleParams.length,
        name: bookTitleParams
      });
      yield put({
        type:"setExistBook",
        payload:{
          list:response.result
        }
      })
    }
  },
  reducers: {
    setDirectoryList(state, { payload: { directoryList } }) {
      return {
        ...state,
        directoryList,
      };
    },
    onScanComplete(state, { payload: { directoryList } }):ScanModelStateType {
      return {
        ...state,
        directoryList,
        displayList:directoryList.map((item) => item.path)
      }
    },
    setExistBook(state : ScanModelStateType,{payload:{list}}):ScanModelStateType{
      return{
        ...state,
        existBook: list
      }
    }
  },
};
