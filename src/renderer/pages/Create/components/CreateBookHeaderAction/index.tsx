import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import styles from './style.less';
import AccountButton from '@/components/AccountButton';
import { User } from '@/services/youcomic/model';
import CheckIcon from '@ant-design/icons/CheckOutlined';
import ReloadIcon from '@ant-design/icons/ReloadOutlined';
import DeleteIcon from '@ant-design/icons/DeleteFilled';
import CloseIcon from '@ant-design/icons/CloseOutlined';
import MenuIcon from '@ant-design/icons/MenuOutlined';
import FileImageIcon from '@ant-design/icons/FileImageFilled';
import ImportIcon from '@ant-design/icons/ImportOutlined';
import TagsIcon from '@ant-design/icons/TagsFilled';
import SyncIcon from '@ant-design/icons/SyncOutlined';
import UploadIcon from '@ant-design/icons/UploadOutlined';
import SaveIcon from '@ant-design/icons/SaveFilled';

export interface CreateBookMultipleActionPopsType {
  onSelectAll: () => void;
  onUnselectAll: () => void;
  onReverseSelect: () => void;
  onDeleteSelectedItem: () => void;
}

interface CreateBookHeaderActionPropsType {
  onImportImages: () => void;
  onSelectCover: () => void;
  isShowMultipleSelectAction: boolean;
  multipleAction: CreateBookMultipleActionPopsType;
  onCreateTag: () => void;
  onSave: () => void;
  onMatchInfo: () => void;
  onAutoImport: () => void;
  user: User;
  onLogin: () => void;
  onLogout: () => void;
  onUploadYouComic: () => void;
  onEditCover: () => void
}

export default function CreateBookHeaderAction({
  onImportImages,
  onSelectCover,
  isShowMultipleSelectAction,
  multipleAction,
  onCreateTag,
  onSave,
  onMatchInfo,
  onAutoImport,
  onLogin,
  onLogout,
  user,
  onUploadYouComic,
  onEditCover
}: CreateBookHeaderActionPropsType) {
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={onImportImages}>
        <ImportIcon />
        导入图片
      </Menu.Item>
      <Menu.Item key="2" onClick={onSelectCover}>
        <FileImageIcon />
        设置封面
      </Menu.Item>
      <Menu.Item key="9" onClick={onEditCover}>
        <FileImageIcon />
        编辑封面
      </Menu.Item>
      <Menu.Item key="3" onClick={onCreateTag}>
        <TagsIcon />
        添加标签
      </Menu.Item>
      {/*<Menu.Item key="4" onClick={onMatchInfo}>*/}
      {/*  <Icon type="scan"/>*/}
      {/*  识别标签*/}
      {/*</Menu.Item>*/}

      <Menu.Item key="5" onClick={onAutoImport}>
        <SyncIcon />
        自动导入
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="10" onClick={onUploadYouComic}>
        <UploadIcon />
        上传至YouComic
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="999" onClick={onSave}>
        <SaveIcon />
        保存
      </Menu.Item>
    </Menu>
  );
  const multipleActionMenu = (
    <Menu>
      <Menu.Item key="1" onClick={multipleAction.onSelectAll}>
        <CheckIcon />
        全选
      </Menu.Item>
      <Menu.Item key="2" onClick={multipleAction.onReverseSelect}>
        <ReloadIcon />
        反选
      </Menu.Item>
      <Menu.Item key="3" onClick={multipleAction.onUnselectAll}>
        <CloseIcon />
        不选
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" onClick={multipleAction.onDeleteSelectedItem}>
        <DeleteIcon />
        移除所选
      </Menu.Item>
    </Menu>
  );
  return (
    <div className={styles.main}>
      {isShowMultipleSelectAction && (
        <Dropdown overlay={multipleActionMenu}>
          <Button type="primary" className={styles.actionButton}>
            多项操作 <MenuIcon />
          </Button>
        </Dropdown>
      )}
      <Dropdown overlay={menu}>
        <Button type="primary" className={styles.actionButton}>
          菜单 <MenuIcon />
        </Button>
      </Dropdown>
      <div className={styles.actionButton}>
        <AccountButton onLogin={onLogin} onLogout={onLogout} user={user} />
      </div>
    </div>
  );
}
