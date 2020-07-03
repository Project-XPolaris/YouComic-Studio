import { ExportLibraryBook } from '@/pages/Library/Explore/module/config';
import { Effect, ExploreLibraryModelStateType, Reducer } from '@@/plugin-dva/connect';
import { checkFileExist, copyFile, removeFiles, selectImageFile } from '@/services/file';
import { nodePath } from '@/global';
import { message } from 'antd';
import uuid from 'uuid';
import { LIBRARY_BOOK_QUICK_VIEW_CREATE_TAG_KEY } from '@/pages/Library/Explore/parts/QuickView';

export interface BookModuleStateTypes {
  books: ExportLibraryBook[],
  page: number,
  pageSize: number,

}

export interface BookModuleTypes {
  state: BookModuleStateTypes,
  effects: {
    setCover: Effect,
    addTag: Effect,
    deleteTag: Effect,
    updateTitle: Effect,
    updateTag: Effect
  },
  reducers: {
    setBooks: Reducer<ExploreLibraryModelStateType>,
    setPagination: Reducer<ExploreLibraryModelStateType>,
    selectBook: Reducer<ExploreLibraryModelStateType>,
    unselectBook: Reducer<ExploreLibraryModelStateType>,
    switchSelectBook: Reducer<ExploreLibraryModelStateType>,
    selectAllBook: Reducer<ExploreLibraryModelStateType>,
    unselectAllBook: Reducer<ExploreLibraryModelStateType>,
    reverseSelectAllBook: Reducer<ExploreLibraryModelStateType>,
    setBookCover: Reducer<ExploreLibraryModelStateType>,
    addBookTag: Reducer<ExploreLibraryModelStateType>,
    deleteBookTag: Reducer<ExploreLibraryModelStateType>,
    updateBookTitle: Reducer<ExploreLibraryModelStateType>,
    updateBookTag: Reducer<ExploreLibraryModelStateType>
  }
}

export const BookModule: BookModuleTypes = {
  state: {
    books: [],
    page: 1,
    pageSize: 24,
  },
  reducers: {
    setBooks(state, { payload: { books } }) {
      return {
        ...state,
        books,
      };
    },
    setPagination(state, { payload: { page, pageSize } }) {
      return {
        ...state,
        page, pageSize,
      };
    },
    selectBook(state, { payload: { books } }) {
      return {
        ...state,
        books: state.books.map((item: ExportLibraryBook) => {
          if (books.find(targetBook => targetBook.path === item.path) !== undefined) {
            return {
              ...item,
              isSelect: true,
            };
          }
          return {
            ...item,
          };
        }),
      };
    },
    unselectBook(state, { payload: { books } }) {
      return {
        ...state,
        books: state.books.map((item: ExportLibraryBook) => {
          if (books.find(targetBook => targetBook.path === item.path) !== undefined) {
            return {
              ...item,
              isSelect: false,
            };
          }
          return {
            ...item,
          };
        }),
      };
    },
    switchSelectBook(state, { payload: { books } }) {
      return {
        ...state,
        books: state.books.map((item: ExportLibraryBook) => {
          if (books.find(targetBook => targetBook.path === item.path) !== undefined) {
            return {
              ...item,
              isSelect: !item.isSelect,
            };
          }
          return {
            ...item,
          };
        }),
      };
    },
    selectAllBook(state, _) {
      return {
        ...state,
        books: state.books.map((item: ExportLibraryBook) => {
          return {
            ...item,
            isSelect: true,
          };
        }),
      };
    },
    unselectAllBook(state, _) {
      return {
        ...state,
        books: state.books.map((item: ExportLibraryBook) => {
          return {
            ...item,
            isSelect: false,
          };
        }),
      };
    },
    reverseSelectAllBook(state, _) {
      return {
        ...state,
        books: state.books.map((item: ExportLibraryBook) => {
          return {
            ...item,
            isSelect: !item.isSelect,
          };
        }),
      };
    },
    setBookCover(state, { payload: { book, coverPath } }) {
      return {
        ...state,
        books: state.books.map((item: ExportLibraryBook) => {
          if (item.path === book.path) {
            return {
              ...item,
              cover: coverPath,
            };
          }
          return {
            ...item,
          };
        }),
      };
    },
    addBookTag(state, { payload: { book, name, type } }) {
      return {
        ...state,
        books: state.books.map(item => {
          if (item.uuid === book.uuid) {
            return {
              ...item,
              tags: [
                ...item.tags,
                { name, type, uuid: uuid.v4() },
              ],
            };
          }
          return {
            ...item,
          };
        }),
      };
    },
    deleteBookTag(state, { payload: { tag } }) {
      return {
        ...state,
        books: state.books.map(item => {
          return {
            ...item,
            tags: item.tags.filter(bookTag => bookTag.uuid !== tag.uuid),
          };
        }),
      };
    },
    updateBookTitle(state, { payload: { book, title } }) {
      return {
        ...state,
        books: state.books.map(it => {
          if (it.uuid === book.uuid) {
            return {
              ...it,
              name: title,
            };
          }
          return {
            ...it,
          };
        }),
      };
    },
    updateBookTag(state, { payload: { tag } }) {
      return {
        ...state,
        books: state.books.map(it => {
          return {
            ...it,
            tags: [...it.tags.map(bookTag => bookTag.uuid !== tag.uuid), tag],
          };
        }),
      };
    },
  },
  effects: {
    * setCover({ payload: { book } }, { call, put, select }) {
      const libraryExploreState: ExploreLibraryModelStateType = yield select(state => state.exploreLibrary);
      const targetBook = libraryExploreState.books.find(libraryBook => libraryBook.uuid === book.uuid);
      if (targetBook === undefined) {
        return;
      }

      const selectImage = yield call(selectImageFile, { path: nodePath.join(libraryExploreState.libraryPath, targetBook.path) });
      if (selectImage === undefined) {
        return;
      }
      const imagePath: string = selectImage[0];
      // check file in library root
      const filename = nodePath.basename(imagePath);
      const filePath = nodePath.join(libraryExploreState.libraryPath, targetBook.path, 'cover_' + filename);
      yield call(copyFile, { from: imagePath, to: filePath });
      // update config
      yield put({
        type: 'setBookCover',
        payload: {
          book: targetBook,
          coverPath: filePath,
        },
      });
      yield put({
        type: 'saveConfig',
      });
      yield call(removeFiles, { paths: [targetBook.cover] });
      message.success('更换成功');
    },
    * addTag({ payload: { book, name, type } }, { call, put, select }) {
      yield put({
        type: 'addBookTag',
        payload: {
          book, name, type,
        },
      });
      yield put({
        type: 'saveConfig',
      });
      yield put({
        type: 'dialogs/setDialogActive',
        payload: {
          key: LIBRARY_BOOK_QUICK_VIEW_CREATE_TAG_KEY,
          isActive: false,
        },
      });
      message.success('添加标签成功');
    },
    * deleteTag({ payload: { tag } }, { put }) {
      yield put({
        type: 'deleteBookTag',
        payload: {
          tag,
        },
      });
      yield put({
        type: 'saveConfig',
      });
    },
    * updateTitle({ payload: { book, title } }, { put }) {
      yield put({
        type: 'updateBookTitle',
        payload: {
          book, title,
        },
      });
      yield put({
        type: 'saveConfig',
      });
    },
    * updateTag({ payload: { tag } }, { put }) {
      yield put({
        type: 'updateBookTag',
        payload: {
          tag,
        },
      });
      yield put({
        type: 'saveConfig',
      });
    },
  },
};

