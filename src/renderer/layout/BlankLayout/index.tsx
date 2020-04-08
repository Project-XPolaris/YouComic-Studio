import React from 'react';
import styles from './style.less';
import { connect } from 'dva';
import { UserModelStateType } from '@/models/user';
import LoginDialog from '@/layout/BaseLayout/components/LoginDialog';
import 'antd/dist/antd.css';
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
  return (
    <div className={styles.main}>
      <LoginDialog onClose={onLoginClose} onOk={onLoginDialogOk} isOpen={user.loginDialog.isOpen} />
      {children}
    </div>
  );
};

export default connect(({ user }) => ({ user }))(BlankLayout);
