import { Effect, Page, Reducer, ScanModelStateType } from '@@/plugin-dva/connect';
import { Book, ListQueryContainer, Tag as TagModel } from '@/services/youcomic/model';
import {
  addTagToBook,
  createNewBook,
  createTag,
  queryTags,
  uploadBookPage,
  uploadCover,
} from '@/services/youcomic/client';
import { differenceWith, forOwn } from 'lodash';
import { fs, nodeFormData } from '@/global';
import { message } from 'antd';

export let stopFlag = false;
export const stopUpload = () => {
  stopFlag = true;
};

export interface UploadModuleStateTypes {

}

export interface UploadModuleTypes {
  state: UploadModuleStateTypes,
  effects: {
    uploadToYouComic: Effect
  }
  reducers: {
    updateUploadDialog: Reducer<ScanModelStateType>
  }
}

export interface BookRollBack {
  id: string
  tags: string[]
  pages: string[]
}

export const UploadModule: UploadModuleTypes = {
  state: {},
  effects: {
    * uploadToYouComic(_, { call, put, select }) {
      const scanState: ScanModelStateType = yield select(state => state.scan);

      yield put({
        type: 'updateUploadDialog',
        payload: {
          dialog: {
            totalCount: scanState.directoryList.length,
            totalProgress: 0,
          },
        },
      });
      for (let idx = 0; idx < scanState.directoryList.length; idx++) {
        const dir = scanState.directoryList[idx];
        const progressTotal = 4;
        yield put({
          type: 'updateUploadDialog',
          payload: {
            dialog: {
              isOpen: true,
              current: dir,
              currentProgress: 0,
              currentInfo: '创建书籍',
              completeCount: idx,
              totalProgress: Math.ceil((idx / scanState.directoryList.length) * 100),
            },
          },
        });
        if (stopFlag) {
          yield put({
            type: 'updateUploadDialog',
            payload: {
              dialog: {
                isOpen: false,
              },
            },
          });
          message.warn('操作已被用户取消');
          stopFlag = false;
          return;
        }
        // create book
        const book: Book = yield call(createNewBook, { name: dir.title });
        // create tags
        yield put({
          type: 'updateUploadDialog',
          payload: {
            dialog: {
              currentProgress: Math.ceil((1 / progressTotal) * 100),
              currentInfo: '添加标签',
            },
          },
        });
        const tags = [];
        forOwn(dir.matchInfo, (value, key) => {
          if (key === 'title') {
            return;
          }
          tags.push({ name: value, type: key });
        });
        // query exists tag
        const queryExistTagResponse: ListQueryContainer<TagModel> = yield call(queryTags, {
          name: tags.map(tag => tag.name),
          page: 1,
          pageSize: tags.length,
        });

        const tagToCreate = differenceWith(
          tags,
          queryExistTagResponse.result,
          (a, b) => a.name === b.name,
        );
        const tagToAdd = queryExistTagResponse.result;
        // create tag
        for (const tagToCreateElement of tagToCreate) {
          const createTagResponse: TagModel = yield call(createTag, {
            name: tagToCreateElement.name,
            type: tagToCreateElement.type,
          });
          tagToAdd.push(createTagResponse);
        }

        const tagIds = tagToAdd.map(tag => tag.id);
        yield call(addTagToBook, { bookId: book.id, tags: tagIds });

        // upload cover
        yield put({
          type: 'updateUploadDialog',
          payload: {
            dialog: {
              currentProgress: Math.ceil((2 / progressTotal) * 100),
              currentInfo: '上传封面',
            },
          },
        });
        const uploadCoverForm = new nodeFormData();
        uploadCoverForm.append('image', fs.createReadStream(dir.coverPath));
        yield call(uploadCover, { form: uploadCoverForm, bookId: book.id });
        // upload page
        yield put({
          type: 'updateUploadDialog',
          payload: {
            dialog: {
              currentProgress: Math.ceil((3 / progressTotal) * 100),
              currentInfo: '上传页面',
            },
          },
        });
        const uploadPageForm = new nodeFormData();
        dir.targetFiles.forEach((file, idx) => {
          uploadPageForm.append(`page_${idx + 1}`, fs.createReadStream(file.path));
        });
        yield call(uploadBookPage, { bookId: book.id, form: uploadPageForm });
      }
      yield put({
        type: 'updateUploadDialog',
        payload: {
          dialog: {
            isOpen: false,
          },
        },
      });
    },
  },
  reducers: {
    updateUploadDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        uploadDialog: {
          ...state.uploadDialog,
          ...dialog,
        },
      };
    },
  },
};
