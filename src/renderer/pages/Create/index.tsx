import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { Card, PageHeader, Typography } from 'antd';
import styles from './style.less';
import { CreateBookModelStateType, Page } from '@/pages/Create/model';
import { history } from 'umi';
import { DirectoryModelStateType } from '@/models/directory';
import { FileListModelStateType } from '@/models/filelist';
import CreateBookHeaderAction, { CreateBookMultipleActionPopsType } from '@/pages/Create/components/CreateBookHeaderAction';
import ImportImageDialog from '@/pages/Create/components/ImportImageDialog';
import { path } from '@/global';
import LoadingDialog from '@/pages/Create/components/LoadingDialog';
import { differenceWith } from 'lodash';
import CreateTagDialog from '@/pages/Create/components/CreateTagDialog';
import MatchTagDialog from '@/pages/Create/components/MatchTagDialog';
import AutoImportProgressDialog from '@/pages/Create/components/AutoImportProgressDialog';
import { UserModelStateType } from '@/models/user';
import CreateBookCoverCrop from '@/pages/Create/crop';
import CreateBookPagesSide from '@/pages/Create/side';
import ToolBox from '@/pages/Create/components/ToolBox';
import CropView from '@/pages/Create/view/Crop';
import BottomBar from '@/pages/Create/components/BottomBar';
import CreateBookBottomBar from '@/pages/Create/bottombar';
import { getCurrentDisplayPageSrc, getImageWidth } from '@/pages/Create/helpers';

const { Paragraph } = Typography;

interface CreateBookPagePropsType {
  dispatch: any;
  create: CreateBookModelStateType;
  directory: DirectoryModelStateType;
  fileList: FileListModelStateType;
  user: UserModelStateType;
}

function CreateBookPage({ dispatch, create, directory, fileList, user }: CreateBookPagePropsType) {
  const { title } = create;
  const [editMode, setEditMode] = useState('normal');
  const imageRef = useRef<HTMLImageElement>();
  const [scalingRatio, setScalingRatio] = useState(undefined);
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
    const isExist =
      create.selectPages.find(selectedPage => selectedPage.name === page.name) !== undefined;
    let newSelectedPages = create.selectPages;
    if (isExist) {
      newSelectedPages = newSelectedPages.filter(selectedPages => selectedPages.name !== page.name);
    } else {
      newSelectedPages = [...newSelectedPages, page];
    }
    dispatch({
      type: 'create/setSelectPage',
      payload: {
        pages: newSelectedPages,
      },
    });
  };
  // const onPageItemClick = () => {
  //
  // };

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
          name,
          type,
        },
      });
      onCancel();
    };
    return (
      // @ts-ignore
      <CreateTagDialog
        isOpen={create.createTagDialog.isOpen}
        onCreate={onCreateTag}
        onClose={onCancel}
      />
    );
  };

  const onDeleteTag = tag => {
    dispatch({
      type: 'create/deleteTag',
      payload: {
        name: tag.name,
      },
    });
  };

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
            pages: differenceWith<Page, Page>(
              create.pages,
              create.selectPages,
              (a: Page, b: Page) => a.name === b.name,
            ),
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
    const onEditCover = () => {
      dispatch({
        type: 'create/openImageCropDialog',
        payload: {
          mode: 'cover',
          path: create.cover,
        },
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
        onEditCover={onEditCover}
      />
    );
  };
  const onCropPage = (page: Page) => {
    dispatch({
      type: 'create/openImageCropDialog',
      payload: {
        mode: 'page',
        path: page.path,
      },
    });
  };
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {

  };


  const renderEditMode = () => {
    return {
      'normal': <div className={styles.normanCanvas}><img src={getCurrentDisplayPageSrc(create)} style={{width:getImageWidth(create)}} ref={imageRef}/></div>,
      'crop': <CropView  onExitMode={() => setEditMode('normal')}/>,
    }[editMode];
  };
  return (
    <div>
      <CreateBookCoverCrop/>
      <LoadingDialog isOpen={create.loadingDialog.isOpen} message={create.loadingDialog.message}/>
      <ImportImageDialog
        isOpen={create.importImageDialog.isShow}
        fileName={create.importImageDialog.fileName}
        progress={create.importImageDialog.progress}
        total={create.importImageDialog.total}
        current={create.importImageDialog.current}
      />
      <AutoImportProgressDialog
        isOpen={create.autoImportDialog.isOpen}
        message={create.autoImportDialog.message}
        progress={create.autoImportDialog.progress}
      />
      {renderCreateTagDialog()}
      {renderMatchTagDialog()}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Card style={{
          position: 'fixed',
          padding: 16,
          top: 64,
          height: '100%',
          left: 0,
          border: '#262626 1px solid',
          zIndex: 999,
        }}
              bodyStyle={{
                padding: 8,
              }}
        >
          <ToolBox
            enterCropMode={() => setEditMode('crop')}
          />
        </Card>
        <div style={{ position: 'fixed', width: '100%', backgroundColor: '#141414' }}>
          <PageHeader
            style={{}}
            onBack={() => history.goBack()}
            title="创建书籍"
            subTitle={dirName}
            extra={renderHeaderAction()}
          />
        </div>
        <div className={styles.main}>

          <div className={styles.leftContent} onWheel={onWheel}>
            {renderEditMode()}
          </div>
          <div className={styles.right}>
            <CreateBookPagesSide/>
          </div>
        </div>
      </div>
      <div className={styles.bottomBarWrap}>
        <div className={styles.bottomBar}>
          <CreateBookBottomBar/>
        </div>
      </div>
    </div>
  );
}

export default connect(({ directory, create, fileList, user }: any) => ({
  directory,
  create,
  fileList,
  user,
}))(CreateBookPage);
