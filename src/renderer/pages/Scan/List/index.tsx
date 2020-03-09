import React, { useEffect } from 'react';
import style from './style.less';
import { connect } from 'dva';
import ScanHeader from '@/pages/Scan/List/header';
import DirectoryCollection from '@/pages/Scan/List/compoennts/DirectoryCollection';
import { Directory, ScanModelStateType } from '@/pages/Scan/List/model';
import ScanningDialog from '@/pages/Scan/List/compoennts/ScanningDialog';
import ScanQuickView from '@/pages/Scan/List/quickview';
import DirectoryScanOptionDrawer from '@/pages/Scan/List/scanoption';
import UploadProgressDialog from '@/pages/Scan/List/compoennts/UploadProgressDialog';
import { HomeModelStateType } from '@/pages/Home/model';

interface ScanPagePropsType {
  scan: ScanModelStateType,
  home:HomeModelStateType
  dispatch: any
}

const ScanPage = ({ scan,home, dispatch }: ScanPagePropsType) => {

  const onDirectoryCardClick = (directory: Directory) => {
    if (scan.selectedDirectory.length > 0) {
      const isSelected = Boolean(scan.selectedDirectory.find(selectItem => selectItem === directory.path));
      if (isSelected) {
        onSelectedDirectoryUpdate(scan.selectedDirectory.filter(selectDirectory => selectDirectory !== directory.path));
      } else {
        onSelectedDirectoryUpdate([
          ...scan.selectedDirectory,
          directory.path,
        ]);
      }
    } else {
      dispatch({
        type: 'scan/quickViewDirectory',
        payload: { directory: directory.path },
      });
    }

  };
  const onSelectedDirectoryUpdate = (updateSelectDirectory: string[]) => {
    dispatch({
      type: 'scan/setSelectedDirectory',
      payload: {
        directoryList: updateSelectDirectory,
      },
    });
  };
  return (
    <div className={style.main}>
      <ScanQuickView/>
      <DirectoryScanOptionDrawer/>
      <ScanHeader/>
      <UploadProgressDialog
        isOpen={scan.uploadDialog.isOpen}
        title={scan.uploadDialog.current?.matchInfo?.title}
        currentInfo={scan.uploadDialog.currentInfo}
        currentPercent={scan.uploadDialog.currentProgress}
        totalPercent={scan.uploadDialog.totalProgress}
        cover={scan.uploadDialog.current?.coverPath}
      />
      <div className={style.content}>
        <DirectoryCollection
          directoryList={scan.directoryList}
          onCardClick={onDirectoryCardClick}
          selectedDirectory={scan.selectedDirectory}
          onSelectedDirectoryUpdate={onSelectedDirectoryUpdate}
        />
      </div>
    </div>
  );
};

export default connect(({ scan,home }) => ({ scan,home }))(ScanPage);
