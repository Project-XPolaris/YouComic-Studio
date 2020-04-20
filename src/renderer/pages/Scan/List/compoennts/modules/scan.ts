import { HomeModelStateType } from '@/pages/Home/model';
import { scanBookDirectory } from '@/services/scan';
import { matchTagInfo } from '@/utils/match';
import { Directory, ScanModelStateType } from '@/pages/Scan/List/model';

export default {
  effects:{
    * scanBookDirectory(state, { call, put, select }) {
      yield put({
        type:"setScanningDialog",
        payload:{
          dialog:{
            isOpen:true
          }
        }
      })
      const homeState: HomeModelStateType = yield select(state => state.home);
      const directoryList: Directory[] = yield call(scanBookDirectory, { path: homeState.path });
      directoryList.forEach((dir: Directory) => {
        const matchResult = matchTagInfo(dir.name)
        dir.matchInfo = matchResult;
        dir.coverPath = dir.targetFiles[0].path;
        dir.extraTags = [];
        dir.title = matchResult.title
      });
      yield put({
        type: 'setDirectoryList',
        payload: {
          directoryList,
        },
      });
      yield put({
        type:"setScanningDialog",
        payload:{
          dialog:{
            isOpen:false
          }
        }
      })
    },
  },
  reducers:{
    setDirectoryList(state, { payload: { directoryList } }) {
      return {
        ...state,
        directoryList,
      };
    },
  }
}
