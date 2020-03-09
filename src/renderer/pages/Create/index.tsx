import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Divider, PageHeader, Tag, Typography } from 'antd';
import styles from './style.less';
import { CreateBookModelStateType, Page } from '@/pages/Create/model';
import { router } from 'umi';
import { DirectoryModelStateType } from '@/models/directory';
import { FileListModelStateType } from '@/models/filelist';
import CreateBookHeaderAction, { CreateBookMultipleActionPopsType } from '@/pages/Create/components/CreateBookHeaderAction';
import ImportImageDialog from '@/pages/Create/components/ImportImageDialog';
import noCoverImage from '@/assets/no-cover.png';
import { path } from '@/global';
import LoadingDialog from '@/pages/Create/components/LoadingDialog';
import PageCollection from '@/pages/Create/components/PageCollection';
import { differenceWith } from 'lodash';
import CreateTagDialog from '@/pages/Create/components/CreateTagDialog';
import TagCollection from '@/pages/Create/components/TagCollection';
import MatchTagDialog from '@/pages/Create/components/MatchTagDialog';
import AutoImportProgressDialog from '@/pages/Create/components/AutoImportProgressDialog';
import { UserModelStateType } from '@/models/user';

const { Paragraph } = Typography;

interface CreateBookPagePropsType {
  dispatch: any,
  create: CreateBookModelStateType
  directory: DirectoryModelStateType
  fileList: FileListModelStateType
  user: UserModelStateType
}

function CreateBookPage({ dispatch, create, directory, fileList, user }: CreateBookPagePropsType) {
  const { title } = create;
  const titleEditConfig = {
    onChange: text => {
      dispatch({
        type: 'create/setTitle',
        payload: {
          title: text,
        },
      });
    },
  };


  const onPagesChange = (newPages: Page[]) => {
    dispatch({
      type: 'create/setNewPages',
      payload: {
        newPages,
      },
    });
  };
  const onPageItemSelect = (page: Page) => {
    const isExist = create.selectPages.find(selectedPage => selectedPage.name === page.name) !== undefined;
    let newSelectedPages = create.selectPages;
    if (isExist) {
      newSelectedPages = newSelectedPages.filter(selectedPages => selectedPages.name !== page.name);
    } else {
      newSelectedPages = [
        ...newSelectedPages,
        page,
      ];
    }
    dispatch({
      type: 'create/setSelectPage',
      payload: {
        pages: newSelectedPages,
      },
    });
  };
  const onPageItemClick = () => {

  };

  const dirName = path.basename(create.rootDir);
  const renderCreateTagDialog = () => {
    const onCancel = () => {
      dispatch({
        type: 'create/setCreateTagDialog',
        payload: {
          dialog: {
            isOpen: false,
          },
        },
      });
    };
    const onCreateTag = (name: string, type: string) => {
      dispatch({
        type: 'create/createTag',
        payload: {
          name, type,
        },
      });
      onCancel();
    };
    return (
      // @ts-ignore
      <CreateTagDialog isOpen={create.createTagDialog.isOpen} onCreate={onCreateTag} onClose={onCancel}/>
    );
  };

  const onDeleteTag = (tag => {
    dispatch({
      type: 'create/deleteTag',
      payload: {
        name: tag.name,
      },
    });
  });


  const renderMatchTagDialog = () => {
    const onCloseDialog = () => {
      dispatch({
        type: 'create/setMatchInfoDialog',
        payload: {
          dialog: {
            isOpen: false,
          },
        },
      });
    };
    const onOk = (tags, title) => {
      if (title !== undefined) {
        dispatch({
          type: 'create/setTitle',
          payload: {
            title,
          },
        });
      }
      dispatch({
        type: 'create/addTags',
        payload: {
          tags,
        },
      });
      onCloseDialog();
    };
    return (
      <MatchTagDialog
        isOpen={create.matchInfoDialog.isOpen}
        onClose={onCloseDialog}
        text={create.path.projectDirectoryName}
        onOk={onOk}
      />
    );
  };
  const renderHeaderAction = () => {
    const onImportImages = () => {
      dispatch({
        type: 'create/generateThumbnails',
      });
    };
    const onSelectImage = () => {
      dispatch({
        type: 'create/selectCover',
      });
    };
    const multipleSelectActionProps: CreateBookMultipleActionPopsType = {
      onSelectAll: () => {
        dispatch({
          type: 'create/setSelectPage',
          payload: {
            pages: create.pages,
          },
        });
      },
      onUnselectAll: () => {
        dispatch({
          type: 'create/setSelectPage',
          payload: {
            pages: [],
          },
        });
      },
      onReverseSelect: () => {
        dispatch({
          type: 'create/setSelectPage',
          payload: {
            pages: differenceWith<Page, Page>(create.pages, create.selectPages, (a: Page, b: Page) => a.name === b.name),
          },
        });
      },
      onDeleteSelectedItem: () => {
        dispatch({
          type: 'create/removeSelectPages',
        });
      },
    };
    const onCreateTagActionClick = () => {
      dispatch({
        type: 'create/setCreateTagDialog',
        payload: {
          dialog: {
            isOpen: true,
          },
        },
      });
    };
    const onOpenMatchInfoDialog = () => {
      dispatch({
        type: 'create/setMatchInfoDialog',
        payload: {
          dialog: {
            isOpen: true,
          },
        },
      });
    };
    const onSaveProject = () => {
      dispatch({
        type: 'create/saveProject',
      });
    };
    const onAutoImport = () => {
      dispatch({
        type: 'create/autoImport',
      });
    };
    const onLogin = () => {
      dispatch({
        type: 'user/showLoginDialog',
      });
    };
    const onLogout = () => {
      dispatch({
        type: 'user/logout',
      });
    };
    const onUploadYouComic = () => {
      dispatch({
        type: 'create/uploadYouComic',
      });
    };
    return (
      <CreateBookHeaderAction
        onImportImages={onImportImages}
        onSelectCover={onSelectImage}
        isShowMultipleSelectAction={create.selectPages.length !== 0}
        multipleAction={multipleSelectActionProps}
        onCreateTag={onCreateTagActionClick}
        onSave={onSaveProject}
        onMatchInfo={onOpenMatchInfoDialog}
        onAutoImport={onAutoImport}
        onLogin={onLogin}
        onLogout={onLogout}
        user={user.current}
        onUploadYouComic={onUploadYouComic}
      />
    );
  };
  return (
    <div>
      <LoadingDialog isOpen={create.loadingDialog.isOpen} message={create.loadingDialog.message}/>
      <ImportImageDialog
        isOpen={create.importImageDialog.isShow}
        fileName={create.importImageDialog.fileName}
        progress={create.importImageDialog.progress}
        total={create.importImageDialog.total}
        current={create.importImageDialog.current}
      />
      <AutoImportProgressDialog isOpen={create.autoImportDialog.isOpen} message={create.autoImportDialog.message}
                                progress={create.autoImportDialog.progress}/>
      {renderCreateTagDialog()}
      {renderMatchTagDialog()}
      <div className={styles.headerWrap}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          onBack={() => router.goBack()}
          title="创建书籍"
          subTitle={dirName}
          extra={renderHeaderAction()}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.header}>
          <div>
            <img src={create.coverThumbnail ? create.coverThumbnail : noCoverImage} className={styles.cover}/>
          </div>
          <div className={styles.info}>
            <Paragraph className={styles.title} editable={titleEditConfig}>{title}</Paragraph>
            <Divider className={styles.divider}/>
            <div>
              <span className={styles.fieldTitle}>标签</span>
              <TagCollection tags={create.tags} onDeleteTag={onDeleteTag}/>
            </div>
          </div>
        </div>
        <div className={styles.pageCollectionWrap}>
          <PageCollection
            pages={create.pages}
            onPagesChange={onPagesChange}
            onItemSelect={onPageItemSelect}
            onItemClick={onPageItemClick}
            selectedPages={create.selectPages}
          />
        </div>
      </div>

    </div>
  );
}

export default connect(({ directory, create, fileList, user }) => ({
  directory,
  create,
  fileList,
  user,
}))(CreateBookPage);
