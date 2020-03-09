import React from 'react';
import { connect } from 'dva';
import { DirectoryModelStateType } from '@/models/directory';
import { Empty } from 'antd';
import styles from './style.less';
import FileCollection from '@/pages/Directory/Home/components/FileCollection';
import { FileListModelStateType } from '@/models/filelist';

interface DirectoryHomePropsType {
  dispatch: any,
  directory: DirectoryModelStateType
  fileList: FileListModelStateType
}

function DirectoryHome({ dispatch, directory, fileList }: DirectoryHomePropsType) {
  const renderContent = () => {
    const { path } = directory;
    if (path === undefined) {
      return (
        <div className={styles.emptyContainer}>
          <Empty description={'请选择文件夹'}/>
        </div>
      );
    } else {
      return (
        <FileCollection items={fileList.directoryMapping[path] ? fileList.directoryMapping[path].children : []}/>
      );
    }
  };
  return (
    <div className={styles.main}>
      {renderContent()}
    </div>
  );
}

export default connect(({ directory, fileList }) => ({ directory, fileList }))(DirectoryHome);
