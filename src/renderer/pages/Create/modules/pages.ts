import { CreateBookModelStateType, Effect, Page, Reducer } from '@@/plugin-dva/connect';
import { cropImage, readImageInfo } from '@/services/image';
import { path } from '@/global';
import { removeFiles } from '@/services/file';
import { message } from 'antd';

export interface PagesModuleStateTypes {
  pages: Page[];
}

export interface PagesModuleTypes {
  state: PagesModuleStateTypes,
  effects: {
    readPageImageInfo: Effect;
    cropPage: Effect;

  }
  reducers: {
    addToPage: Reducer<CreateBookModelStateType>
    setPages: Reducer<CreateBookModelStateType>
    updatePage: Reducer<CreateBookModelStateType>
  }
}

export const PagesModule: PagesModuleTypes = {
  state: {
    pages: [],
  },
  effects: {
    * readPageImageInfo({ payload }, { call, put }) {
      const { page }: { page: Page } = payload;
      const imageMeta = yield call(readImageInfo, { imagePath: page.path });
      yield put({
        type: 'updatePage',
        payload: {
          path: page.path,
          updatePage: {
            meta: imageMeta,
          },
        },
      });
    },
    * cropPage({ payload: { x, y, width, height, cropWidth, cropHeight } }, { call, put, select }) {
      console.log("crop page ...")
      // get page to crop
      const createState: CreateBookModelStateType = yield select(state => state.create);
      const targetPage = createState.pages.find((page: Page) => page.name === createState.currentImageName);
      if (targetPage === undefined) {
        return;
      }


      // crop image
      const { filePath, thumbnailPath } = yield call(cropImage, {
        filePath: targetPage.path,
        outputDir: createState.path.projectPages,
        outputThumbnailDir: path.join(createState.path.projectPath, 'thumbnails'),
        x, y, width, height, cropWidth, cropHeight,
      });
      //
      // update page
      const cropPage: Page = {
        name: path.basename(filePath),
        path: filePath,
        thumbnail: thumbnailPath,
        thumbnailName: path.basename(thumbnailPath),
      };
      //
      console.log(cropPage)

      yield put({
        type: 'updatePage',
        payload: {
          path: targetPage.path,
          updatePage: cropPage,
        },
      });
      //
      // save project
      yield put({
        type: 'updateConfigPage',
        payload: {
          filename: targetPage.name,
          updatePage: {
            file: path.basename(filePath),
            thumbnail: path.basename(thumbnailPath),
          },
        },
      });
      yield put({
        type: 'saveProject',
      });

      // clear up
      yield call(removeFiles, { paths: [targetPage.path, targetPage.thumbnail] });
      // update current display page
      yield put({
        type: 'changeDisplayPage',
        payload: {
          page: cropPage,
        },
      });
      message.success('编辑页面成功');
    },
  },
  reducers: {
    addToPage(state, { payload: { pages, index = state.pages.length } }) {
      const newPages = [...state.pages];
      newPages.splice(index, 0, ...pages);
      return {
        ...state,
        pages: [...newPages],
      };
    },
    setPages(state, { payload: { pages } }) {
      return {
        ...state,
        pages,
      };
    },
    updatePage(state, { payload: { path, updatePage } }) {
      return {
        ...state,
        pages: state.pages.map((page: Page) => {
          if (page.path === path) {
            return {
              ...page,
              ...updatePage,
            };
          }
          return {
            ...page,
          };
        }),
      };
    },
  },
};
