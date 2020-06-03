import { Directory, Effect, Page, Reducer, ScanModelStateType } from '@@/plugin-dva/connect';
import { Book } from '@/services/youcomic/model';

const filterActionMapping: { [key: string]: { [key: string]: (state: ScanModelStateType, item: Directory) => boolean } } = {
  'title': {
    'exist': (state, item) => {
      return item.title !== undefined && item.title.length !== 0;
    },
    'notExist': (state, item) => {
      return item.title === undefined || item.title.length === 0;
    },
    'notSet': () => {
      return true;
    },
  },
  'artist': {
    'exist': (state, item) => {
      return item.matchInfo.artist !== undefined;
    },
    'notExist': (state, item) => {
      return item.matchInfo.artist === undefined;
    },
    'notSet': () => {
      return true;
    },
  },
  'series': {
    'exist': (state, item) => {
      return item.matchInfo.series !== undefined;
    },
    'notExist': (state, item) => {
      return item.matchInfo.series === undefined;
    },
    'notSet': () => {
      return true;
    },
  },
  'theme': {
    'exist': (state, item) => {
      return item.matchInfo.theme !== undefined;
    },
    'notExist': (state, item) => {
      return item.matchInfo.theme === undefined;
    },
    'notSet': () => {
      return true;
    },
  },
  'inLibrary': {
    'exist': (state, item) => {
      return state.existBook.find((book: Book) => book.name === item.title) !== undefined;
    },
    'notExist': (state, item) => {
      return state.existBook.find((book: Book) => book.name === item.title) === undefined;
    },
    'notSet': () => {
      return true;
    },
  },
};

export interface BookFilterModuleStateTypes {
  filterDrawer: {
    isShow: boolean
  }
  filter: { [key: string]: string }
}

export interface BookFilterModuleTypes {
  state: BookFilterModuleStateTypes,
  effects: {}
  reducers: {
    setDirFilter: Reducer<ScanModelStateType>
    setFilterDrawerVisible: Reducer<ScanModelStateType>
  }
}

export const BookFilterModule: BookFilterModuleTypes = {
  state: {
    filterDrawer: {
      isShow: false,
    },
    filter: {},
  },
  effects: {},
  reducers: {
    setDirFilter(state: ScanModelStateType, { payload: { filter } }): ScanModelStateType {
      return {
        ...state,
        filter,
        directoryList: state.directoryList.map(item => {
          for (const filterField of Object.getOwnPropertyNames(filter)) {
            if (!filterActionMapping[filterField][filter[filterField]](state, item)) {
              return {
                ...item,
                item: {
                  ...item.item,
                  visible: false,
                },
              };
            }
          }
          return {
            ...item,
            item: {
              ...item.item,
              visible: true,
            },
          };
        }),
      };
    },
    setFilterDrawerVisible(state, { payload: { isShow } }) {
      return {
        ...state,
        filterDrawer: {
          ...state.filterDrawer,
          isShow,
        },
      };
    },
  },
};

