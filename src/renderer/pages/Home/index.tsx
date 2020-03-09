import React from 'react';
import { Avatar, Button, Divider, Dropdown, Icon, Input, Menu, Typography } from 'antd';
import styles from './style.less';
import { connect } from 'dva';
import { HomeModelStateType } from '@/pages/Home/model';
import LoadingDirectoryDialog from '@/pages/Home/components/LoadingDirectoryDialog';
import { router } from 'umi';
import header from '@/pages/Scan/List/header';
import { UserModelStateType } from '@/models/user';
import CreateNewProjectDialog from '@/pages/Home/components/CreateNewDialog';

const { Search } = Input;
const { Title } = Typography;


interface HomePagePropsType {
  home: HomeModelStateType,
  dispatch,
  user: UserModelStateType
}

const HomePage = ({ home, dispatch, user }: HomePagePropsType) => {
  const onScan = () => {
    dispatch({
      type: 'home/onScanFolder',
      payload: {},
    });
  };
  const onLoginAccount = () => {
    dispatch({
      type: 'user/showLoginDialog',
    });
  };
  const renderUserAccount = () => {
    const onLogout = () => {
      dispatch({
        type:"user/logout"
      })
    }
    const accountMenu = (
      <Menu>
        <Menu.Item key="1" onClick={onLogout}>
          <Icon type="export" />
          登出
        </Menu.Item>
      </Menu>
    )
    if (user.current) {
      return (
        <div className={styles.accountIndicate}>
          <Dropdown overlay={accountMenu}>
            <Button type={'ghost'}>
              <Avatar className={styles.avatar} size={'small'}>
                {user.current.nickname.toUpperCase()[0]}
              </Avatar>
              {user.current.nickname}
            </Button>
          </Dropdown>

        </div>
      );
    } else {
      return (
        <Button type={'ghost'} size={'small'} className={styles.loginButton} onClick={onLoginAccount}><Icon
          type="user"/>登录至YouComic</Button>
      );
    }
  };
  const onCreateNewClick = () => {
    dispatch({
      type:"home/openCreateNewProjectDialog",
    })
  }
  const onCreateNewDialogCancel = () => {
    dispatch({
      type:"home/closeCreateNewProjectDialog",
    })
  }
  const onSelectSavePath = () => {
    dispatch({
      type:"home/selectNewProjectSaveLocation"
    })
  }
  const onCreateNewDialogOk = () => {
    dispatch({
      type:"home/createNew"
    })
  }
  const onOpenProjectClick = () => {
    dispatch({
      type:"home/openExistProject"
    })
  }
  const onSettingButtonClick = () => {
    router.push("/setting")
  }
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <CreateNewProjectDialog
          isOpen={home.createDialog.isOpen}
          onOk={onCreateNewDialogOk}
          onClose={onCreateNewDialogCancel}
          path={home.createDialog.path}
          onSelectSaveFolder={onSelectSavePath}
        />
        <div>
          <span className={styles.title}>开始</span>
        </div>
        <div className={styles.headerRight}>
          <span>Project Polaris{`  `}| {`  `}You Comic</span>
          {renderUserAccount()}
        </div>
      </div>
      <Divider/>
      <div className={styles.content}>
        <div className={styles.field}>
          <div className={styles.fieldTitle}>
            创建项目
          </div>
          <div>
            <Button type="primary" onClick={onCreateNewClick} className={styles.actionButton}><Icon type="plus"/>创建新的项目</Button>
          </div>
          <div>
            <Button type="primary" onClick={onOpenProjectClick} className={styles.actionButton}><Icon type="folder"/>打开已有项目</Button>

          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldTitle}>
            批量编辑
          </div>
          <div>
            <Button type="primary" onClick={onScan}><Icon type="search"/>扫描文件夹</Button>
          </div>
        </div>
      </div>
      <div className={styles.bottomRight}>
      <Button onClick={onSettingButtonClick} shape={"circle"}><Icon type={"setting"} /></Button>
      </div>
    </div>
  );
};

export default connect(({ home, fileList, scan, user }) => ({ home, fileList, scan, user }))(HomePage);
