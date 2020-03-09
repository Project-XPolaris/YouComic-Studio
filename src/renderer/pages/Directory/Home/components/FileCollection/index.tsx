import React from 'react';
import { ChildrenItem } from '@/pages/List/components/SideTree';
import { Col, Dropdown, List, Menu } from 'antd';
import FileItem from '@/pages/Directory/Home/components/FileItem';

import styles from './style.less';

interface FileCollectionPropsType {
  items?: ChildrenItem[]
}


export default function FileCollection({ items = [] }: FileCollectionPropsType) {
  const renderItems = () => {
    return items.map(item => {
      return (
        <Col key={item.path}>
          <FileItem item={item}/>
        </Col>
      );
    });
  };
  const menu = (
    <Menu>
      <Menu.Item key="1">1st menu item</Menu.Item>
      <Menu.Item key="2">2nd menu item</Menu.Item>
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  );
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 8,
      }}
      dataSource={items}
      renderItem={item => (
        <List.Item className={styles.item}>
          <a>
          <FileItem item={item}/>
          </a>
        </List.Item>
      )}
    />
  );
}
