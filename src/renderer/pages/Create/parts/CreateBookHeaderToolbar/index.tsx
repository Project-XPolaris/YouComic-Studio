import React from 'react';
import { connect, Dispatch } from 'dva';
import styles from './style.less';
import { AppstoreOutlined, FileOutlined } from '@ant-design/icons/lib';
import { Button } from 'antd';
import { CreateBookModelStateType } from '@/pages/Create/model';

interface CreateBookHeaderToolbarPropsType {
  dispatch: Dispatch,
  create: CreateBookModelStateType
}

function CreateBookHeaderToolbar({ dispatch, create }: CreateBookHeaderToolbarPropsType) {
  const onSwitchPageCollection = (e) => {
    e.preventDefault()
    dispatch({
      type: 'create/switchPageCollection',
    });
  };
  const onSwitchToolbar = () => {
    dispatch({
      type:"create/switchToolbar"
    })
  }
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Button
          className={styles.actionButton}
          type={create.showToolbar?'primary':'ghost'}
          size={'small'}
          icon={<AppstoreOutlined/>}
          onClick={onSwitchToolbar}
        />
      </div>
      <div className={styles.center}>

      </div>
      <div className={styles.right}>
        <Button
          className={styles.actionButton}
          onClick={onSwitchPageCollection}
          type={create.showPageCollection?'primary':'ghost'}
          size={'small'}
          icon={<FileOutlined/>}/>
      </div>
    </div>
  );
}

export default connect(({ create }: any) => ({ create }))(CreateBookHeaderToolbar);
