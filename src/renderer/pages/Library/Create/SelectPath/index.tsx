import React from 'react';
import { Dispatch } from 'umi';
import { Button, Input, PageHeader } from 'antd';
import styles from './style.less';
import ScanningDialog from '@/pages/Scan/List/compoennts/ScanningDialog';
import { DialogsModelStateType } from '@/models/dialog';
import { CreateLibraryModelStateType } from '@/pages/Library/Create/model';
import { connect } from '@@/plugin-dva/exports';

const { Search } = Input;

interface SelectBookLibraryPathPropsType {
  dispatch: Dispatch,
  dialogs: DialogsModelStateType
  createLibrary: CreateLibraryModelStateType
}

export const CreateLibraryScanDialogKey = 'createLibrary/scanDialog';

function SelectBookLibraryPath({ dispatch, dialogs, createLibrary }: SelectBookLibraryPathPropsType) {
  return (
    <div className={styles.main}>
      <ScanningDialog isOpen={Boolean(dialogs?.activeDialogs[CreateLibraryScanDialogKey])}/>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="选择构建的媒体库路径"
      />
      <div className={styles.content}>
        <div className={styles.searchInputContainer}>
          <Search
            placeholder="路径"
            enterButton="选择路径"
            value={createLibrary.buildPath}
            onChange={(e) => {
              dispatch({ type: 'createLibrary/setBuildPath', payload: { path: e.target.value } });
            }}
            onSearch={value => {
              dispatch({
                type: 'createLibrary/selectPath',
              });
            }}
          />
        </div>
        <Button
          className={styles.nextButton}
          type={'primary'}
          onClick={() => dispatch({ type: 'createLibrary/selectPathNext' })}
        >下一步</Button>
      </div>
    </div>
  );
}

export default connect(({createLibrary,dialogs}:any) => ({createLibrary,dialogs}))(SelectBookLibraryPath)
