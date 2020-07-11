import React from 'react';
import styles from './style.less';
import { connect } from 'dva';
import { UserModelStateType } from '@/models/user';
import LoginDialog from '@/layout/BaseLayout/components/LoginDialog';
import { BorderOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons/lib';
import { app, remote } from '@/global';

interface BlankLayoutPropsType {
  children: any;
  dispatch: any;
  user: UserModelStateType;
}

const BlankLayout = ({ children, dispatch, user }: BlankLayoutPropsType) => {
  const onLoginClose = () => {
    dispatch({
      type: 'user/closeLoginDialog',
    });
  };
  const onLoginDialogOk = (username: string, password: string) => {
    dispatch({
      type: 'user/login',
      payload: {
        username,
        password,
      },
    });
  };
  const onClose = () => {
    app.exit();
  };
  const onMax = () => {
    const currentWindow = remote.BrowserWindow.getFocusedWindow();
    if (currentWindow.isMaximized()) {
      currentWindow.unmaximize();
    } else {
      currentWindow.maximize();
    }

  };
  const onMin = () => {
    remote.BrowserWindow.getFocusedWindow().minimize();
  };
  return (
    <div className={styles.main}>
      <LoginDialog onClose={onLoginClose} onOk={onLoginDialogOk} isOpen={user.loginDialog.isOpen}/>
      <div className={styles.statusBar}>
        <div className={styles.title}>
          YouComic Studio
        </div>
        <div className={styles.dragZone}>
        </div>
        <div>
          <a className={styles.actionButton} onClick={onMin}>
            <MinusOutlined/>
          </a>
          <a className={styles.actionButton} onClick={onMax}>
            <BorderOutlined/>
          </a>
          <a className={styles.actionButton} onClick={onClose}>
            <CloseOutlined/>
          </a>
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>

    </div>
  );
};

export default connect(({ user }) => ({ user }))(BlankLayout);
