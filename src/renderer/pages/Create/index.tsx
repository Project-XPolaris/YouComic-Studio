import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { PageHeader, Typography } from 'antd';
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
import { Application, Sprite, Texture, filters, Filter, Graphics } from 'pixi.js';
import MaskManager from '@/pages/Create/components/MaskManager';

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
  const [pixiApp, setPixiApp] = useState<Application>();
  const imageRef = useRef<HTMLImageElement>();
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
    console.log(page);
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
      'normal': <img src={create.displaySrc} style={{}} ref={imageRef}/>,
      'crop': <CropView onExitMode={() => setEditMode('normal')}/>,
    }[editMode];
  };


  const pixiContainer = useRef<HTMLDivElement>();
  useEffect(() => {
    let app = pixiApp;
    if (pixiApp === undefined) {
      app = new Application({
        transparent: true,
        antialias: true,
        resolution: 3,
      });
      setPixiApp(app);
    }
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.top = '0px';
    app.renderer.view.style.left = '0px';
    app.renderer.view.style.width = '100%';
    app.renderer.view.style.height = '100%';
    app.resizeTo = pixiContainer.current;
    pixiContainer.current.appendChild(app.view);
  }, []);
  const [imageSprite, setImageSprite] = useState<Sprite>();
  const [lastSrc, setLastSrc] = useState<string>();
  // if (imageSprite !== undefined){
  //   pixiApp.stage.removeChild(imageSprite)
  // }
  if (create.displaySrc && pixiApp && create.displaySrc !== lastSrc) {
    setLastSrc(create.displaySrc);
    const bunny = Sprite.from(
      create.displaySrc,
    );
    bunny.anchor.set(0.5, 0.5);
    bunny.scale.set(0.5, 0.5);
    bunny.position.set(pixiApp.screen.width / 2, pixiApp.screen.height / 2);
    setImageSprite(bunny);
    // bunny.mask = mask;
    pixiApp.stage.addChild(bunny);
    // thing.beginFill(0x8bc5ff, 0.4);
    const graphics = new Graphics();

    let rectWidth = 100
    let rectHeight = 100
    graphics.beginFill(0xffffff,0.00001);
    graphics.lineStyle(3, 0xFEEB77, 1);
    graphics.drawRect(pixiApp.screen.width / 2, pixiApp.screen.height / 2, rectWidth, rectHeight);
    graphics.interactive = true
    // draw handler
    let data,dragging;
    function onDragStart(event) {
      // store a reference to the data
      // the reason for this is because of multitouch
      // we want to track the movement of this particular touch
      console.log("dragStart")
      data = event.data;
      dragging = true;
    }
    function onDragEnd() {
      dragging = false;
      // set the interaction data to null
      data = null;
      console.log("dragEnd")
    }
    function onDragMove(e) {
      console.log("dragMove")
      if (dragging) {
        graphics.x += e.data.originalEvent.movementX;
        graphics.y += e.data.originalEvent.movementY;
      }
    }

    graphics.endFill();
    graphics.on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);
    pixiApp.stage.addChild(graphics);

    window.addEventListener('resize', () => {
      bunny.anchor.set(0.5, 0.5);
      bunny.scale.set(0.5, 0.5);
      bunny.position.set(pixiApp.screen.width / 2, pixiApp.screen.height / 2);
    });

  }
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
        {/*<div style={{*/}
        {/*  backgroundColor: '#535353',*/}
        {/*  position: 'fixed',*/}
        {/*  padding: 16,*/}
        {/*  top: 45,*/}
        {/*  height: '100%',*/}
        {/*  left: 0,*/}
        {/*  border: '#262626 1px solid',*/}
        {/*  zIndex: 999,*/}
        {/*}}>*/}
        {/*  <ToolBox*/}
        {/*    enterCropMode={() => setEditMode('crop')}*/}
        {/*  />*/}
        {/*</div>*/}
        <div style={{ position: 'fixed', width: '100%' }}>
          <PageHeader
            style={{
              backgroundColor: '#535353',
            }}
            onBack={() => history.goBack()}
            title="创建书籍"
            subTitle={dirName}
            extra={renderHeaderAction()}
          />
        </div>
        <div className={styles.main}>

          <div className={styles.leftContent} onWheel={onWheel} ref={pixiContainer}>
            <div style={{position:"absolute",right:0,top:0}}>
              <MaskManager/>
            </div>
          </div>
          <div className={styles.right}>
            <CreateBookPagesSide/>
          </div>
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
