import React from 'react';
import { connect } from 'umi';
import DirectoryQuickViewDrawer from '@/pages/Scan/List/compoennts/DirectoryQuickViewDrawer';
import { ScanModelStateType } from '@/pages/Scan/List/model';
import CreateTagDialog from '@/pages/Create/components/CreateTagDialog';

interface ScanQuickViewPropsType {
  dispatch: any;
  scan: ScanModelStateType;
}

function ScanQuickView({
  dispatch,
  scan: {
    quickViewDrawer: { isOpen, directory },
    createTagDialog,
    directoryList,
  },
}: ScanQuickViewPropsType) {
  const onDrawerClose = () => dispatch({ type: 'scan/closeQuickViewDirectoryDrawer' });
  const onInfoChange = (key: string, newValue: string) => {
    dispatch({
      type: 'scan/updateItemsValue',
      payload: {
        key,
        newValue,
      },
    });
  };
  const onSelectCoverFile = () => {
    dispatch({
      type: 'scan/selectItemCover',
    });
  };
  const openCreateTagDialog = () => {
    dispatch({
      type: 'scan/openCreateTagDialog',
      payload: {
        action: 'create',
      },
    });
  };
  const closeCreateTagDialog = () => {
    dispatch({
      type: 'scan/closeCreateTagDialog',
    });
  };
  const onCreateTag = (name: string, type: string) => {
    dispatch({
      type: 'scan/createTag',
      payload: {
        name,
        type,
      },
    });
  };
  const directoryItem = directoryList.find(item => item.path === directory);
  return (
    <div>
      <CreateTagDialog
        // @ts-ignore
        isOpen={createTagDialog.isOpen}
        onClose={closeCreateTagDialog}
        onCreate={onCreateTag}
      />
      <DirectoryQuickViewDrawer
        onClose={onDrawerClose}
        visible={isOpen}
        coverURL={directoryItem?.coverPath}
        title={directoryItem?.title}
        artist={directoryItem?.matchInfo?.artist}
        theme={directoryItem?.matchInfo?.theme}
        series={directoryItem?.matchInfo?.series}
        translator={directoryItem?.matchInfo?.translator}
        pages={directoryItem?.targetFiles.map(file => ({ path: file.path }))}
        onInfoChange={onInfoChange}
        onSelectCoverAction={onSelectCoverFile}
        onAddTag={openCreateTagDialog}
        dirname={directoryItem?.name}
        extraTags={directoryItem?.extraTags}
      />
    </div>
  );
}

export default connect(({ scan }:any) => ({ scan }))(ScanQuickView);
