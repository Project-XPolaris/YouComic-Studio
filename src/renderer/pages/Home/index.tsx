import React from 'react';
import { Avatar, Button, Divider, Dropdown, Menu, Typography } from 'antd';
import styles from './style.less';
import { HomeModelStateType } from '@/pages/Home/model';
import { connect, history } from 'umi';
import { UserModelStateType } from '@/models/user';
import CreateNewProjectDialog from '@/pages/Home/components/CreateNewDialog';
import LogoutIcon from '@ant-design/icons/ExportOutlined';
import UserIcon from '@ant-design/icons/UserOutlined';
import SettingIcon from '@ant-design/icons/SettingOutlined';
import FolderIcon from '@ant-design/icons/FolderFilled';
import CreateIcon from '@ant-design/icons/PlusOutlined';
import SearchIcon from '@ant-design/icons/SearchOutlined';

const { Title } = Typography;

interface HomePagePropsType {
  home: HomeModelStateType;
  dispatch;
  user: UserModelStateType;
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
        type: 'user/logout',
      });
    };
    const accountMenu = (
      <Menu>
        <Menu.Item key="1" onClick={onLogout}>
          <LogoutIcon/>
          登出
        </Menu.Item>
      </Menu>
    );
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
        <Button
          type={'ghost'}
          size={'small'}
          className={styles.loginButton}
          onClick={onLoginAccount}
          icon={ <UserIcon/>}
        >

          登录至YouComic
        </Button>
      );
    }
  };
  const onCreateNewClick = () => {
    dispatch({
      type: 'home/openCreateNewProjectDialog',
    });
  };
  const onCreateNewDialogCancel = () => {
    dispatch({
      type: 'home/closeCreateNewProjectDialog',
    });
  };
  const onSelectSavePath = () => {
    dispatch({
      type: 'home/selectNewProjectSaveLocation',
    });
  };
  const onCreateNewDialogOk = () => {
    dispatch({
      type: 'home/createNew',
    });
  };
  const onOpenProjectClick = () => {
    dispatch({
      type: 'home/openExistProject',
    });
  };
  const onSettingButtonClick = () => {
    history.push('/setting');
  };
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
        <div className={styles.title}>
          开始
        </div>
        <div className={styles.headerRight}>
          <span className={styles.appInfo}>
            Project XPolaris{`  `}| {`  `}You Comic
          </span>
          {renderUserAccount()}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.field}>
          <div className={styles.fieldTitle}>创建项目</div>
          <div>
            <Button type="primary" onClick={onCreateNewClick} className={styles.actionButton}>
              <CreateIcon/>
              创建新的项目
            </Button>
          </div>
          <div>
            <Button type="primary" onClick={onOpenProjectClick} className={styles.actionButton}>
              <FolderIcon/>
              打开已有项目
            </Button>
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldTitle}>批量编辑</div>
          <div>
            <Button type="primary" onClick={onScan}>
              <SearchIcon/>
              扫描文件夹
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.bottomRight}>
        <Button onClick={onSettingButtonClick} shape={'circle'} type={'primary'} className={styles.settingIcon}>
          <SettingIcon/>
        </Button>
      </div>
    </div>
  );
};

export default connect(({ home, fileList, scan, user }: any) => ({ home, fileList, scan, user }))(
  HomePage,
);
