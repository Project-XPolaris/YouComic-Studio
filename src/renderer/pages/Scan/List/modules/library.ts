import { Effect, Page, Reducer, ScanModelStateType } from '@@/plugin-dva/connect';
import { LibraryExportConfig, saveLibraryExportConfigFile } from '@/services/library';
import { nodePath, path, slash } from '@/global';
import { notification } from 'antd';

export interface LibraryModuleStateTypes {

}

export interface LibraryModuleTypes {
  state: LibraryModuleStateTypes,
  effects: {
    exportAsLibrary: Effect
  }
  reducers: {}
}

export const LibraryModule: LibraryModuleTypes = {
  state: {},
  effects: {
    * exportAsLibrary(_, { call, put, select }) {
      const scanState: ScanModelStateType = yield select(state => state.scan);

      const config: LibraryExportConfig = {
        name: nodePath.basename(scanState.scanPath),
        books:scanState.directoryList.map(item => {
          return {
            path:slash(item.path.replace(scanState.scanPath, '')),
            name:item.title,
            pages:item.targetFiles.map((pageFile, idx) => {
              return {
                path: slash(pageFile.path.replace(item.path, '')),
                order: idx,
              };
            }),
            cover:slash(item.coverPath.replace(item.path, '')),
            tags:[...item.extraTags,...Object.getOwnPropertyNames(item.matchInfo)
              .filter(key => key !== 'title')
              .map(key => {
                return { type: key, name: item.matchInfo[key] };
              })]
          }
        })
      };
      notification['success']({
        message: 'YouComic Studio',
        description:
          '成功转换为Library',
      })
      yield call(saveLibraryExportConfigFile, {
        config,
        savePath: path.join(scanState.scanPath, 'library_export.json'),
      });
    },
  },
  reducers: {},
};
