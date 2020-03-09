import React from 'react';
import { connect } from 'dva';
import { Directory, ScanModelStateType } from '@/pages/Scan/List/model';
import { router } from 'umi';
import { Affix, Button, Dropdown, Icon, Menu, PageHeader } from 'antd';
import { differenceWith } from 'lodash';
import styles from './header.less';
import SubMenu from 'antd/es/menu/SubMenu';
import AccountButton from '@/components/AccountButton';
import { UserModelStateType } from '@/models/user';

interface ScanHeaderPropsType {
  scan: ScanModelStateType
  dispatch: any
  user:UserModelStateType
}

const ScanHeader = (
  {
    dispatch,
    scan,
    user,
  }: ScanHeaderPropsType) => {
  const onScanMenuAction = () => {
    dispatch({
      type: 'scan/scanBookDirectory',
    });
  };
  const openScanOptionDrawer = () => {
    dispatch({
      type: 'scan/openScanOptionDrawer',
    });
  };
  const onMenuActionSelectAll = () => {
    dispatch({
      type: 'scan/setSelectedDirectory',
      payload: {
        directoryList: scan.directoryList.map(item => (item.path)),
      },
    });
  };
  const onMenuActionUnselectAll = () => {
    dispatch({
      type: 'scan/setSelectedDirectory',
      payload: {
        directoryList: [],
      },
    });
  };
  const onMenuActionReverseSelect = () => {
    dispatch({
      type: 'scan/setSelectedDirectory',
      payload: {
        directoryList: differenceWith<Directory, string>(scan.directoryList, scan.selectedDirectory, (a: Directory, b: string) => a.path === b).map(it => (it.path)),
      },
    });
  };
  const onMenuActionAddTags = () => {
    dispatch({
      type: 'scan/openCreateTagDialog',
      payload: {
        action: 'multipleCreate',
      },
    });
  };
  const onMenuActionRemoveSelectedDirectory = () => {
    dispatch({
      type: 'scan/removeSelectDirectory',
    });
  };
  const onUploadToYouComic = () => {
    dispatch({
      type: 'scan/uploadToYouComic',
    });
  };
  const onLogin = () => {
    dispatch({
      type:"user/showLoginDialog"
    })
  }
  const onLogout = () => {
    dispatch({
      type:"user/logout"
    })
  }
  const menu = (
    <Menu>
      <Menu.Item onClick={onScanMenuAction}><Icon type="search"/>扫描</Menu.Item>
      <Menu.Divider/>
      <Menu.Item onClick={openScanOptionDrawer}><Icon type="setting"/>设置扫描参数</Menu.Item>
      <Menu.Divider/>
      <Menu.Item onClick={onUploadToYouComic}><Icon type="global"/>上传至YouComic</Menu.Item>

    </Menu>
  );
  const multipleActionMenu = (
    <Menu>
      <Menu.Item onClick={onMenuActionSelectAll}><Icon type="check"/>全选</Menu.Item>
      <Menu.Item onClick={onMenuActionReverseSelect}><Icon type="reload"/>反选</Menu.Item>
      <Menu.Item onClick={onMenuActionUnselectAll}><Icon type="close"/>取消选择</Menu.Item>
      <Menu.Divider/>
      <Menu.Item onClick={onMenuActionAddTags}><Icon type="tag"/>添加标签</Menu.Item>
      <Menu.Divider/>
      <Menu.Item onClick={onMenuActionRemoveSelectedDirectory}><Icon type="delete"/>从列表中移除</Menu.Item>

    </Menu>
  );
  const headerAction = (
    <div>
      {
        scan.selectedDirectory.length !== 0 &&
        <Dropdown overlay={multipleActionMenu}>
          <Button className={styles.headerActionButton}><Icon type="menu"/>{`选中${scan.selectedDirectory.length}项`}
          </Button>
        </Dropdown>
      }

      <Dropdown overlay={menu} placement={'bottomLeft'}>
        <Button type="primary" className={styles.headerActionButton}><Icon type="menu"/>菜单</Button>
      </Dropdown>
      <span className={styles.accountButtonWrap}>
        <AccountButton user={user.current} onLogin={onLogin} onLogout={onLogout}/>
      </span>
    </div>
  );
  return (
    <div>
      <Affix>
        <PageHeader
          className={styles.header}
          onBack={() => router.goBack()}
          title="扫描"
          extra={headerAction}
        />
      </Affix>
    </div>
  );
};
export default connect(({ scan,user }) => ({ scan,user }))(ScanHeader);

