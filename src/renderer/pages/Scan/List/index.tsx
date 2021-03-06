import React from 'react';
import style from './style.less';
import { connect } from 'umi';
import ScanHeader from '@/pages/Scan/parts/ScanHeader';
import DirectoryCollection from '@/pages/Scan/List/compoennts/DirectoryCollection';
import { Directory, ScanModelStateType } from '@/pages/Scan/List/model';
import ScanQuickView from '@/pages/Scan/List/quickview';
import DirectoryScanOptionDrawer from '@/pages/Scan/List/scanoption';
import UploadProgressDialog from '@/pages/Scan/List/compoennts/UploadProgressDialog';
import { HomeModelStateType } from '@/pages/Home/model';
import ScanningDialog from '@/pages/Scan/List/compoennts/ScanningDialog';
import { Book } from '@/services/youcomic/model';
import DirFilterDrawer from '@/pages/Scan/List/filterdrawer';

interface ScanPagePropsType {
  scan: ScanModelStateType;
  home: HomeModelStateType;
  dispatch: any;
}

const ScanPage = ({ scan, dispatch }: ScanPagePropsType) => {
  const onDirectoryCardClick = (directory: Directory) => {
    if (scan.selectedDirectory.length > 0) {
      const isSelected = Boolean(
        scan.selectedDirectory.find(selectItem => selectItem === directory.path),
      );
      if (isSelected) {
        onSelectedDirectoryUpdate(
          scan.selectedDirectory.filter(selectDirectory => selectDirectory !== directory.path),
        );
      } else {
        onSelectedDirectoryUpdate([...scan.selectedDirectory, directory.path]);
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
      <DirFilterDrawer/>
      <ScanningDialog isOpen={scan.scanningDialog.isOpen}/>
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
          existBookNames={scan.existBook.map((book: Book) => book.name)}
          displayDirPath={scan.displayList}
        />
      </div>
    </div>
  );
};

export default connect(({ scan, home }: any) => ({ scan, home }))(ScanPage);
