import React from 'react';
import { connect } from 'dva';
import { Directory, ScanModelStateType } from '@/pages/Scan/List/model';
import { router } from 'umi';
import { Affix, Button, Dropdown, Menu, PageHeader } from 'antd';
import { differenceWith } from 'lodash';
import styles from './header.less';
import AccountButton from '@/components/AccountButton';
import { UserModelStateType } from '@/models/user';
import SearchIcon from '@ant-design/icons/SearchOutlined';
import SettingIcon from '@ant-design/icons/SettingOutlined';
import GlobalIcon from '@ant-design/icons/GlobalOutlined';
import CheckIcon from '@ant-design/icons/CheckOutlined';
import ReloadIcon from '@ant-design/icons/ReloadOutlined';
import TagIcon from '@ant-design/icons/TagFilled';
import CloseIcon from '@ant-design/icons/CloseOutlined';
import DeleteIcon from '@ant-design/icons/DeleteFilled';
import MenuIcon from '@ant-design/icons/MenuOutlined';
import SetTitleIcon from '@ant-design/icons/EditOutlined';
import InputTitleDialog from '@/pages/Scan/List/compoennts/InputTitleDialog';
import { DialogKeys, DialogsModelStateType } from '@/models/dialog';
interface ScanHeaderPropsType {
  scan: ScanModelStateType;
  dispatch: any;
  user: UserModelStateType;
  dialogs: DialogsModelStateType;
}

const ScanHeader = ({ dispatch, scan, user, dialogs: { activeDialogs } }: ScanHeaderPropsType) => {
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
        directoryList: scan.directoryList.map(item => item.path),
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
        directoryList: differenceWith<Directory, string>(
          scan.directoryList,
          scan.selectedDirectory,
          (a: Directory, b: string) => a.path === b
        ).map(it => it.path),
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
      type: 'user/showLoginDialog',
    });
  };
  const onLogout = () => {
    dispatch({
      type: 'user/logout',
    });
  };
  const menu = (
    <Menu>
      <Menu.Item onClick={onScanMenuAction}>
        <SearchIcon />
        扫描
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={openScanOptionDrawer}>
        <SettingIcon />
        设置扫描参数
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={onUploadToYouComic}>
        <GlobalIcon />
        上传至YouComic
      </Menu.Item>
    </Menu>
  );
  const onOpenInputTitle = () => {
    dispatch({
      type: 'dialogs/setDialogActive',
      payload: {
        key: DialogKeys.ScanInputMultipleTitle,
        isActive: true,
      },
    });
  };
  const renderInputTitleDialog = () => {
    const onCloseInputTitle = () => {
      dispatch({
        type: 'dialogs/setDialogActive',
        payload: {
          key: DialogKeys.ScanInputMultipleTitle,
          isActive: false,
        },
      });
    };
    const onOk = (title: string) => {
      dispatch({
        type: 'scan/setSelectTitle',
        payload: {
          title,
        },
      });
      onCloseInputTitle();
    };
    return (
      <InputTitleDialog
        isOpen={Boolean(activeDialogs[DialogKeys.ScanInputMultipleTitle])}
        onOK={onOk}
        onCancel={onCloseInputTitle}
      />
    );
  };
  const multipleActionMenu = (
    <Menu>
      <Menu.Item onClick={onMenuActionSelectAll}>
        <CheckIcon />
        全选
      </Menu.Item>
      <Menu.Item onClick={onMenuActionReverseSelect}>
        <ReloadIcon />
        反选
      </Menu.Item>
      <Menu.Item onClick={onMenuActionUnselectAll}>
        <CloseIcon />
        取消选择
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={onMenuActionAddTags}>
        <TagIcon />
        添加标签
      </Menu.Item>
      <Menu.Item onClick={onOpenInputTitle}>
        <SetTitleIcon />
        编辑标题
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={onMenuActionRemoveSelectedDirectory}>
        <DeleteIcon />
        从列表中移除
      </Menu.Item>
    </Menu>
  );
  const headerAction = (
    <div>
      {scan.selectedDirectory.length !== 0 && (
        <Dropdown overlay={multipleActionMenu}>
          <Button className={styles.headerActionButton}>
            <MenuIcon />
            {`选中${scan.selectedDirectory.length}项`}
          </Button>
        </Dropdown>
      )}

      <Dropdown overlay={menu} placement={'bottomLeft'}>
        <Button type="primary" className={styles.headerActionButton}>
          <MenuIcon />
          菜单
        </Button>
      </Dropdown>
      <span className={styles.accountButtonWrap}>
        <AccountButton user={user.current} onLogin={onLogin} onLogout={onLogout} />
      </span>
    </div>
  );
  return (
    <div>
      {renderInputTitleDialog()}
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
export default connect(({ scan, user, dialogs }) => ({ scan, user, dialogs }))(ScanHeader);
