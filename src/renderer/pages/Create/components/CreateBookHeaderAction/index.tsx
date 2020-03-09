import React from 'react';
import { Button, Divider, Dropdown, Icon, Menu } from 'antd';
import styles from './style.less';
import AccountButton from '@/components/AccountButton';
import { User } from '@/services/youcomic/model';

export interface CreateBookMultipleActionPopsType {
  onSelectAll: () => void
  onUnselectAll: () => void
  onReverseSelect: () => void
  onDeleteSelectedItem: () => void
}

interface CreateBookHeaderActionPropsType {
  onImportImages: () => void
  onSelectCover: () => void
  isShowMultipleSelectAction: boolean
  multipleAction: CreateBookMultipleActionPopsType
  onCreateTag: () => void
  onSave:() => void
  onMatchInfo:() => void
  onAutoImport:() => void
  user:User
  onLogin:() => void
  onLogout:() => void
  onUploadYouComic:() => void
}


export default function CreateBookHeaderAction(
  {
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
    onUploadYouComic
  }: CreateBookHeaderActionPropsType) {
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={onImportImages}>
        <Icon type="import"/>
        导入图片
      </Menu.Item>
      <Menu.Item key="2" onClick={onSelectCover}>
        <Icon type="file-image"/>
        设置封面
      </Menu.Item>
      <Menu.Item key="3" onClick={onCreateTag}>
        <Icon type="tags"/>
        添加标签
      </Menu.Item>
      {/*<Menu.Item key="4" onClick={onMatchInfo}>*/}
      {/*  <Icon type="scan"/>*/}
      {/*  识别标签*/}
      {/*</Menu.Item>*/}

      <Menu.Item key="5" onClick={onAutoImport}>
        <Icon type="sync"/>
        自动导入
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item key="10" onClick={onUploadYouComic}>
        <Icon type="upload"/>
        上传至YouComic
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item key="999" onClick={onSave}>
        <Icon type="save"/>
        保存
      </Menu.Item>
    </Menu>
  );
  const multipleActionMenu = (
    <Menu>
      <Menu.Item key="1" onClick={multipleAction.onSelectAll}>
        <Icon type="check"/>
        全选
      </Menu.Item>
      <Menu.Item key="2" onClick={multipleAction.onReverseSelect}>
        <Icon type="reload"/>
        反选
      </Menu.Item>
      <Menu.Item key="3" onClick={multipleAction.onUnselectAll}>
        <Icon type="close"/>
        不选
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item key="4" onClick={multipleAction.onDeleteSelectedItem}>
        <Icon type="delete"/>
        移除所选
      </Menu.Item>
    </Menu>
  );
  return (
    <div className={styles.main}>
      {isShowMultipleSelectAction && <Dropdown overlay={multipleActionMenu}>
        <Button type="primary" className={styles.actionButton}>
          多项操作 <Icon type="menu"/>
        </Button>
      </Dropdown>}
      <Dropdown overlay={menu}>
        <Button type="primary" className={styles.actionButton}>
          菜单 <Icon type="menu"/>
        </Button>
      </Dropdown>
      <div className={styles.actionButton}>
        <AccountButton onLogin={onLogin} onLogout={onLogout} user={user} />
      </div>
    </div>
  );
}
