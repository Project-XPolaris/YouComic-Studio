import { cropImage, generateImageThumbnail } from '@/services/image';
import { message } from 'antd';
import {
  deleteBookPagesFile,
  getFilesWithExtension,
  loadCoverFile,
  readFileStat,
  readProjectConfig,
  removeFiles,
  selectImageFile,
  showSelectFolderDialog,
  writeFile,
} from '@/services/file';
import { fs, mkdirp, nodeFormData, path, projectPathConfig } from '@/global';
import { differenceWith } from 'lodash';
import { matchTagInfo } from '@/utils/match';
import { HomeModelStateType } from '@/pages/Home/model';
import { Book, ListQueryContainer, Tag as TagModel } from '@/services/youcomic/model';
import {
  addTagToBook,
  createNewBook,
  createTag,
  queryTags,
  uploadBookPage,
  uploadCover,
} from '@/services/youcomic/client';
import { ImagesModule, ImagesModuleTypes } from '@/pages/Create/modules/images';
import { PagesModule, PagesModuleStateTypes, PagesModuleTypes } from '@/pages/Create/modules/pages';
import { ViewModule, ViewModuleStateTypes, ViewModuleTypes } from '@/pages/Create/modules/view';
import { devVars } from '@/development';
import { Effect, Reducer, Subscription } from '@@/plugin-dva/connect';
import { LayoutModule, LayoutModuleStateTypes, LayoutModuleTypes } from '@/pages/Create/modules/layout';

export interface ProjectConfig {
  pages: Array<{
    file: string;
    thumbnail: string;
  }>;
  cover?: string;
  coverThumbnail?: string;
  title?: string;
  tags?: Tag[];
}

export interface Page {
  name: string;
  path: string;
  thumbnail: string;
  thumbnailName: string;
  meta?: {
    width?: number;
    height?: number;
  }
}

export interface Tag {
  name: string;
  type: string;
}

export type CreateBookModelStateType = BaseCreateBookModelStateType & PagesModuleStateTypes & ViewModuleStateTypes & LayoutModuleStateTypes

interface BaseCreateBookModelStateType {
  title: string;
  importImageDialog: {
    progress: number;
    isShow: boolean;
    total: number;
    fileName: string;
    current: number;
  };
  createTagDialog: {
    isOpen: boolean;
  };
  loadingDialog: {
    isOpen: false;
    message: string;
  };
  matchInfoDialog: {
    isOpen: boolean;
  };
  cropImageDialog: {
    isOpen: boolean;
    mode: 'cover' | 'page';
    src: string;
  };
  cover?: string;
  coverThumbnail?: string;
  rootDir: string;
  config?: ProjectConfig;
  path: {
    projectPath?: string;
    projectDirectoryName?: string;
    projectConfig?: string;
    projectPages?: string;
  };
  selectPages: Page[];
  tags: Tag[];
  autoImportDialog: {
    isOpen: boolean;
    progress: number;
    message: string;
  };
  displaySrc?: string
}

export interface BaseCreateBookModelType {
  namespace: string;
  reducers: {
    setRootPath: Reducer<CreateBookModelStateType>;
    setTitle: Reducer<CreateBookModelStateType>;
    setImportImagesDialog: Reducer<CreateBookModelStateType>;
    setCover: Reducer<CreateBookModelStateType>;
    setLoadingDialog: Reducer<CreateBookModelStateType>;
    setConfig: Reducer<CreateBookModelStateType>;
    updateConfig: Reducer<CreateBookModelStateType>;
    setPath: Reducer<CreateBookModelStateType>;
    setSelectPage: Reducer<CreateBookModelStateType>;
    setCreateTagDialog: Reducer<CreateBookModelStateType>;
    addTags: Reducer<CreateBookModelStateType>;
    setTags: Reducer<CreateBookModelStateType>;
    setMatchInfoDialog: Reducer<CreateBookModelStateType>;
    setAutoImportDialog: Reducer<CreateBookModelStateType>;
    clear: Reducer<CreateBookModelStateType>;
    openImageCropDialog: Reducer<CreateBookModelStateType>;
    closeImageCropDialog: Reducer<CreateBookModelStateType>;
    updateConfigPage: Reducer<CreateBookModelStateType>;
    setDisplaySrc: Reducer<CreateBookModelStateType>;
  };
  state: CreateBookModelStateType;
  effects: {
    generateThumbnails: Effect;
    selectCover: Effect;
    init: Effect;
    saveConfig: Effect;
    setNewPages: Effect;
    onRemovePages: Effect;
    removeSelectPages: Effect;
    saveProject: Effect;
    createTag: Effect;
    deleteTag: Effect;
    autoImport: Effect;
    uploadYouComic: Effect;
    cropCover: Effect
  };
  subscriptions: {
    setup: Subscription;
  };
}

type CreateBookModelType = BaseCreateBookModelType & ImagesModuleTypes & PagesModuleTypes & ViewModuleTypes & LayoutModuleTypes
const CreateBookModel: CreateBookModelType = {
  namespace: 'create',
  state: {
    title: '点击输入标题',
    importImageDialog: {
      progress: 0,
      isShow: false,
      total: 1,
      fileName: '',
      current: 0,
    },
    loadingDialog: {
      message: '',
      isOpen: false,
    },
    createTagDialog: {
      isOpen: false,
    },
    tags: [],
    path: {},
    rootDir: '',
    selectPages: [],
    matchInfoDialog: {
      isOpen: false,
    },
    autoImportDialog: {
      isOpen: false,
      progress: 0,
      message: '',
    },
    cropImageDialog: {
      isOpen: false,
      src: '',
      mode: 'cover',
    },
    ...ImagesModule.state,
    ...PagesModule.state,
    ...ViewModule.state,
    ...LayoutModule.state,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/book/create') {
          dispatch({
            type: 'init',
          });
        }
      });
    },
  },
  effects: {
    ...ImagesModule.effects,
    ...PagesModule.effects,
    ...ViewModule.effects,
    ...LayoutModule.effects,
    * generateThumbnails({ payload: { index = 0 } }, { call, put, select }) {
      const { create }: { create: CreateBookModelStateType } = yield select(state => state);
      const dirPath = create.rootDir;
      if (dirPath === undefined) {
        return;
      }
      const dirPaths = yield call(selectImageFile, { path: dirPath });
      if (!Boolean(dirPaths.filePaths)) {
        return;
      }
      const imageFiles = dirPaths.filePaths;
      let progressCount = 0;
      const pages: Page[] = [];
      mkdirp(create.path.projectPages);
      for (let idx = 0; idx < imageFiles.length; idx += 1) {
        const fileName = path.basename(imageFiles[idx]);
        yield put({
          type: 'setImportImagesDialog',
          payload: {
            dialog: {
              ...create.importImageDialog,
              isShow: true,
              progress: Math.round((progressCount / imageFiles.length) * 100),
              fileName,
              current: idx,
              total: imageFiles.length,
            },
          },
        });
        const { imagePath, imageName, thumbnail, thumbnailName } = yield call(
          generateImageThumbnail,
          {
            sourcePath: imageFiles[idx],
            projectPath: create.path.projectPath,
          },
        );
        pages.push({
          path: imagePath,
          name: imageName,
          thumbnail,
          thumbnailName,
        });
        progressCount += 1;
      }
      yield put({
        type: 'addToPage',
        payload: {
          pages,
          index:index + 1,
        },
      });
      yield put({
        type: 'saveProject',
      });
      yield put({
        type: 'setImportImagesDialog',
        payload: {
          dialog: {
            ...create.importImageDialog,
            isShow: false,
            progress: 100,
            fileName: '',
          },
        },
      });
      message.success(`成功导入${progressCount}个图片`);
    },
    * selectCover(_, { call, put, select }) {
      const create: CreateBookModelStateType = yield select(state => state.create);
      const dirPath = create.rootDir;
      if (dirPath === undefined) {
        return;
      }

      const dirPaths = yield call(selectImageFile, { path: dirPath });
      if (!Boolean(dirPaths.filePaths)) {
        return;
      }
      const imagePath = dirPaths.filePaths[0];
      const { cover, thumbnail, coverName, thumbnailName } = yield call(loadCoverFile, {
        originFilePath: create.cover,
        originThumbnailPath: create.coverThumbnail,
        filePath: imagePath,
        projectPath: create.path.projectPath,
      });
      yield put({
        type: 'setCover',
        payload: {
          cover,
          thumbnail,
        },
      });
      yield put({
        type: 'saveProject',
      });
    },
    * init(_, { call, put, select }) {
      const homeState: HomeModelStateType = yield select(state => state.home);
      let editPath = homeState.editorPath;
      if (devVars.enable && devVars['editPath'] !== undefined) {
        editPath = devVars['editPath'];
      }
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'setRootPath',
        payload: {
          path: editPath,
        },
      });
      let createState: CreateBookModelStateType = yield select(state => state.create);
      // check cache
      try {
        yield call(readFileStat, { filePath: createState.path.projectPath });
      } catch (e) {
        if (e.code === 'ENOENT') {
          return;
        }
      }
      // read config file
      const projectConfig: ProjectConfig = yield call(readProjectConfig, { projectPath: editPath });
      yield put({
        type: 'setConfig',
        payload: {
          config: projectConfig,
        },
      });
      yield put({
        type: 'setPath',
        payload: {
          path: {
            projectPath: editPath,
            projectDirectoryName: path.basename(editPath),
            projectConfig: path.join(editPath, 'project.json'),
            projectPages: path.join(editPath, projectPathConfig.projectPagesDirectory),
          },
        },
      });
      createState = yield select(state => state.create);

      // loading cover
      if (
        createState.config.cover !== undefined &&
        createState.config.coverThumbnail !== undefined
      ) {
        yield put({
          type: 'setCover',
          payload: {
            cover: path.join(createState.path.projectPath, createState.config.cover),
            thumbnail: path.join(createState.path.projectPath, createState.config.coverThumbnail),
          },
        });
      }

      // loading pages
      yield put({
        type: 'addToPage',
        payload: {
          pages: createState.config.pages.map(page => ({
            path: path.join(createState.path.projectPages, page.file),
            name: page.file,
            thumbnail: path.join(
              createState.path.projectPath,
              projectPathConfig.projectThumbnailsDirectory,
              page.thumbnail,
            ),
            thumbnailName: page.thumbnail,
          })),
        },
      });

      // loading tags
      yield put({
        type: 'setTags',
        payload: {
          tags: createState.config.tags,
        },
      });
      // loading title
      if (createState.config.title !== undefined) {
        yield put({
          type: 'setTitle',
          payload: {
            title: createState.config.title,
          },
        });
      }

      // set init display image
      createState = yield select(state => state.create);
      if (createState.pages.length > 0) {
        yield put({
          type: 'changeDisplayPage',
          payload: {
            page: createState.pages[0],
          },
        });
      }
      yield put({
        type: 'setLoadingDialog',
        payload: {
          dialog: {
            isOpen: false,
            message: '',
          },
        },
      });
      message.success('已加载缓存中的数据');
    },
    * saveConfig(_, { call, put, select }) {
      const { create }: { create: CreateBookModelStateType } = yield select(state => state);
      if (create.config !== undefined) {
        yield call(writeFile, {
          path: create.path.projectConfig,
          data: JSON.stringify(create.config),
        });
      }
    },
    * setNewPages({ payload: { newPages } }, { call, put, select }) {
      yield put({
        type: 'setPages',
        payload: {
          pages: newPages,
        },
      });
      yield put({
        type: 'setConfig',
        payload: {
          config: {
            pages: newPages.map((page: Page) => ({
              file: page.name,
              thumbnail: page.thumbnailName,
            })),
          },
        },
      });
      yield put({
        type: 'saveProject',
      });
    },
    * removeSelectPages(_, { call, put, select }) {
      const createState: CreateBookModelStateType = yield select(state => state.create);
      yield put({
        type: 'onRemovePages',
        payload: {
          pagesToRemove: createState.selectPages,
        },
      });
      yield put({
        type: 'setSelectPage',
        payload: {
          pages: [],
        },
      });
    },
    * onRemovePages({ payload: { pagesToRemove } }, { call, put, select }) {
      // init
      const createState: CreateBookModelStateType = yield select(state => state.create);
      const remainPages = differenceWith<Page, Page>(
        createState.pages,
        pagesToRemove,
        (a: Page, b: Page) => a.name === b.name,
      );
      // remove from pages
      yield put({
        type: 'setPages',
        payload: {
          pages: remainPages,
        },
      });
      // delete file
      yield call(deleteBookPagesFile, {
        pages: pagesToRemove.map((page: Page) => ({
          filePath: page.path,
          thumbnailPath: page.thumbnail,
        })),
      });
      // update config
      yield put({
        type: 'saveProject',
      });
    },
    * saveProject(_, { call, put, select }) {
      const createState: CreateBookModelStateType = yield select(state => state.create);

      const config: ProjectConfig = {
        title: createState.title,
        pages: createState.pages.map((page: Page) => ({
          thumbnail: page.thumbnailName,
          file: page.name,
        })),
      };
      if (createState.cover !== undefined && createState.coverThumbnail !== undefined) {
        config.cover = path.basename(createState.cover);
        config.coverThumbnail = path.basename(createState.coverThumbnail);
      }
      if (createState.tags !== undefined) {
        config.tags = createState.tags;
      }
      yield call(writeFile, { path: createState.path.projectConfig, data: JSON.stringify(config) });
    },
    * createTag({ payload: { name, type } }, { call, put, select }) {
      const createState: CreateBookModelStateType = yield select(state => state.create);
      const { tags = [] } = createState;
      yield put({
        type: 'setTags',
        payload: {
          tags: [...tags, { name, type }],
        },
      });
      yield put({
        type: 'saveProject',
      });
    },
    * deleteTag({ payload: { name } }, { call, put, select }) {
      const createState: CreateBookModelStateType = yield select(state => state.create);
      yield put({
        type: 'setTags',
        payload: {
          tags: createState.tags.filter((tag: Tag) => tag.name !== name),
        },
      });
      yield put({
        type: 'saveProject',
      });
    },
    * autoImport(_, { call, put, select }) {
      const createState: CreateBookModelStateType = yield select(state => state.create);
      const dirPaths = yield call(showSelectFolderDialog, {});
      if (!Boolean(dirPaths.filePaths)) {
        return;
      }
      const scanPath = dirPaths.filePaths[0];
      if (scanPath === undefined) {
        message.info('未选择目录');
        return;
      }
      yield put({
        type: 'setAutoImportDialog',
        payload: {
          dialog: {
            isOpen: true,
            message: '扫描文件结构',
            progress: 0,
          },
        },
      });
      const imageFiles: string[] = yield call(getFilesWithExtension, {
        sourceDirectoryPath: scanPath,
        extensions: ['.png', '.jpg', '.jpeg'],
      });
      yield put({
        type: 'setAutoImportDialog',
        payload: {
          dialog: {
            isOpen: true,
            message: '设置封面',
            progress: 10,
          },
        },
      });
      // get cover
      let coverFileName;
      if (imageFiles.length > 0) {
        coverFileName = imageFiles[0];
      }
      const { cover, thumbnail, coverName, thumbnailName } = yield call(loadCoverFile, {
        originFilePath: createState.cover,
        originThumbnailPath: createState.coverThumbnail,
        filePath: path.join(scanPath, coverFileName),
        projectPath: createState.path.projectPath,
      });
      yield put({
        type: 'setCover',
        payload: {
          cover,
          thumbnail,
        },
      });
      // getPages
      mkdirp(createState.path.projectPages);
      const pages: Page[] = [];
      for (let imageIdx = 0; imageIdx < imageFiles.length; imageIdx += 1) {
        yield put({
          type: 'setAutoImportDialog',
          payload: {
            dialog: {
              isOpen: true,
              message: `导入页面 ${imageIdx + 1} of ${imageFiles.length}`,
              progress: 20 + Math.ceil(70 * (imageIdx / imageFiles.length)),
            },
          },
        });
        const imageFile = imageFiles[imageIdx];
        const { imagePath, imageName, thumbnail, thumbnailName } = yield call(
          generateImageThumbnail,
          {
            sourcePath: path.join(scanPath, imageFile),
            projectPath: createState.path.projectPath,
          },
        );
        pages.push({ name: imageName, path: imagePath, thumbnail, thumbnailName });
      }
      yield put({
        type: 'setPages',
        payload: {
          pages,
        },
      });
      yield put({
        type: 'setAutoImportDialog',
        payload: {
          dialog: {
            isOpen: true,
            message: `识别信息`,
            progress: 90,
          },
        },
      });
      // match tag
      const info = matchTagInfo(path.basename(scanPath));
      if (info) {
        yield put({
          type: 'setTags',
          payload: {
            tags: Object.getOwnPropertyNames(info)
              .filter(tagType => tagType !== 'title')
              .map(tagType => ({
                name: info[tagType],
                type: tagType,
              })),
          },
        });
        // title
        if (info.title !== undefined) {
          yield put({
            type: 'setTitle',
            payload: {
              title: info.title,
            },
          });
        }
      }
      // save config

      yield put({
        type: 'saveProject',
      });
      yield put({
        type: 'setAutoImportDialog',
        payload: {
          dialog: {
            isOpen: false,
            message: `完成`,
            progress: 100,
          },
        },
      });
    },
    * uploadYouComic(_, { call, put, select }) {
      const createState: CreateBookModelStateType = yield select(state => state.create);
      // must have cover
      if (createState.cover === undefined || createState.cover.length === 0) {
        return;
      }
      // must have title
      if (createState.title === undefined || createState.title.trim().length === 0) {
        return;
      }

      // create book
      const createdBook: Book = yield call(createNewBook, { name: createState.title });
      // create tags
      // query existed tags
      const queryTagsResponse: ListQueryContainer<TagModel> = yield call(queryTags, {
        name: createState.tags.map(tag => tag.name),
      });

      // create tags where is not exist
      const tagsToCreate = differenceWith<Tag, TagModel>(
        createState.tags,
        queryTagsResponse.result,
        (a, b) => a.name === b.name,
      );
      const createdTags: TagModel[] = queryTagsResponse.result;
      for (const tagToCreate of tagsToCreate) {
        const createdTag: TagModel = yield call(createTag, {
          name: tagToCreate.name,
          type: tagToCreate.type,
        });
        createdTags.push(createdTag);
      }
      // add tag to book
      yield call(addTagToBook, { bookId: createdBook.id, tags: createdTags.map(tag => tag.id) });

      // upload cover
      const uploadCoverForm = new nodeFormData();
      uploadCoverForm.append('image', fs.createReadStream(createState.cover));
      yield call(uploadCover, { form: uploadCoverForm, bookId: createdBook.id });

      // upload pages
      const uploadPageForm = new nodeFormData();
      createState.pages.forEach((page, idx) => {
        uploadPageForm.append(`page_${idx + 1}`, fs.createReadStream(page.path));
      });
      yield call(uploadBookPage, { bookId: createdBook.id, form: uploadPageForm });
      message.success('上传成功');
    },
    * cropCover({ payload: { x, y, width, height, cropWidth, cropHeight } }, { call, put, select }) {
      const createState: CreateBookModelStateType = yield select(state => state.create);
      const { filePath, thumbnailPath } = yield call(cropImage, {
        filePath: createState.cover,
        outputDir: createState.path.projectPath,
        x, y, width, height, cropWidth, cropHeight,
      });
      yield put({
        type: 'setCover',
        payload: {
          cover: filePath,
          thumbnail: thumbnailPath,
        },
      });
      yield put({
        type: 'saveProject',
      });
      // clear up
      yield call(removeFiles, { paths: [createState.cover, createState.coverThumbnail] });
      yield put({
        type: 'closeImageCropDialog',
      });
      message.success('编辑封面成功');
    },

  },
  reducers: {
    ...ImagesModule.reducers,
    ...PagesModule.reducers,
    ...ViewModule.reducers,
    ...LayoutModule.reducers,
    setTitle(state, { payload: { title } }) {
      return {
        ...state,
        title,
      };
    },
    setImportImagesDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        importImageDialog: dialog,
      };
    },
    setCover(state, { payload: { cover, thumbnail } }) {
      return {
        ...state,
        cover,
        coverThumbnail: thumbnail,
      };
    },
    setLoadingDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        loadingDialog: dialog,
      };
    },

    setConfig(state, { payload: { config } }) {
      return {
        ...state,
        config,
      };
    },
    updateConfig(state, { payload: { config } }) {
      return {
        ...state,
        config: {
          ...state.config,
          ...config,
        },
      };
    },
    setPath(state, { payload: { path } }) {
      return {
        ...state,
        path: {
          ...state.path,
          ...path,
        },
      };
    },

    setSelectPage(state, { payload: { pages } }) {
      return {
        ...state,
        selectPages: pages,
      };
    },
    setCreateTagDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        createTagDialog: dialog,
      };
    },
    addTags(state, { payload: { tags } }) {
      return {
        ...state,
        tags: [...state.tags, ...tags],
      };
    },
    setTags(state, { payload: { tags } }) {
      return {
        ...state,
        tags,
      };
    },
    setMatchInfoDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        matchInfoDialog: dialog,
      };
    },
    setAutoImportDialog(state, { payload: { dialog } }) {
      return {
        ...state,
        autoImportDialog: dialog,
      };
    },
    setRootPath(state, { payload: { path } }) {
      return {
        ...state,
        rootDir: path,
      };
    },
    clear(state, _): any {
      return {
        title: '点击输入标题',
        importImageDialog: {
          progress: 0,
          isShow: false,
          total: 1,
          fileName: '',
          current: 0,
        },
        loadingDialog: {
          message: '',
          isOpen: false,
        },
        createTagDialog: {
          isOpen: false,
        },
        tags: [],
        path: {},
        pages: [],
        rootDir: '',
        selectPages: [],
        matchInfoDialog: {
          isOpen: false,
        },
        autoImportDialog: {
          isOpen: false,
          progress: 0,
          message: '',
        },
        zoomRatio: 0.5,
      };
    },
    openImageCropDialog(state, { payload: { mode, path } }): CreateBookModelStateType {
      return {
        ...state,
        cropImageDialog: {
          ...state.cropImageDialog,
          mode, src: path, isOpen: true,
        },
      };
    },
    closeImageCropDialog(state, _) {
      return {
        ...state,
        cropImageDialog: {
          ...state.cropImageDialog,
          isOpen: false,
        },
      };
    },

    updateConfigPage(state, { payload: { filename, updatePage } }) {
      return {
        ...state,
        config: {
          ...state.config,
          pages: state.config.pages.map(item => {
            if (item.file === filename) {
              return {
                ...item,
                ...updatePage,
              };
            }
            return {
              ...item,
            };
          }),
        },
      };
    },
    setDisplaySrc(state, { payload: { src } }) {
      return {
        ...state,
        displaySrc: src,
      };
    },
  },
};
export default CreateBookModel;
