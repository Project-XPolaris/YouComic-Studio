import { ExportLibraryBook } from '@/pages/Library/Explore/module/config';
import { ExploreLibraryModelStateType, Reducer } from '@@/plugin-dva/connect';

export interface BookModuleStateTypes {
  books: ExportLibraryBook[],
  page: number,
  pageSize: number
}

export interface BookModuleTypes {
  state: BookModuleStateTypes,
  effects: {},
  reducers: {
    setBooks: Reducer<ExploreLibraryModelStateType>,
    setPagination: Reducer<ExploreLibraryModelStateType>,
    selectBook: Reducer<ExploreLibraryModelStateType>,
    unselectBook: Reducer<ExploreLibraryModelStateType>,
    switchSelectBook: Reducer<ExploreLibraryModelStateType>,
    selectAllBook:Reducer<ExploreLibraryModelStateType>,
    unselectAllBook:Reducer<ExploreLibraryModelStateType>,
    reverseSelectAllBook:Reducer<ExploreLibraryModelStateType>,
  }
}

export const BookModule: BookModuleTypes = {
  state: {
    books: [],
    page: 1,
    pageSize: 12,
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
  },
  effects: {},
};