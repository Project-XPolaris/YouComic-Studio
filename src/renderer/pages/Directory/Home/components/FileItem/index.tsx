import React from 'react';
import { ChildrenItem } from '@/pages/List/components/SideTree';
import { Dropdown, Icon, Menu } from 'antd';
import styles from './style.less';

interface FileItemPropsType {
  item: ChildrenItem
}


export default function FileItem({ item }: FileItemPropsType) {
  const renderContent = () => {
    if (item.type === "file" && (item.name.endsWith(".jpg") || item.name.endsWith(".png"))){
      return(
        <img src={item.path} className={styles.image} alt={item.name} />
      )
    }
    return (
      <Icon type="file"/>
    )
  };
  const menu = (
    <Menu>
      <Menu.Item key="1">aaa</Menu.Item>
      <Menu.Item key="2">2nd menu item</Menu.Item>
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
    <div className={styles.main}>
      <div className={styles.content}>
        <div>
          {renderContent()}
        </div>
        <div className={styles.name}>
          {item.name}
        </div>
      </div>
    </div>
    </Dropdown>
  );
}
