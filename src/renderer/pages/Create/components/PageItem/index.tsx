import React from 'react';
import { Card, Dropdown, Menu } from 'antd';
import { Page } from '@/pages/Create/model';
import styles from './style.less';
import { CheckOutlined, ScissorOutlined } from '@ant-design/icons/lib';

interface PageItemPropsType {
  page: Page
  order: number
  onClick: (page: Page) => void
  onSelect: (page: Page) => void
  onCrop:(page:Page) => void
  isSelected?: boolean
}


export default function PageItem({ page, order, onClick, onSelect, isSelected = false,onCrop }: PageItemPropsType) {
  const onImageDragStart = (e: any) => {
    e.preventDefault();
  };
  const onCardClick = () => {
    onClick(page);
  };
  const onSelectAction = () => {
    onSelect(page);
  };
  const onCropAction = () => {
    onCrop(page)
  }
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={onSelectAction}><CheckOutlined />选中</Menu.Item>
      <Menu.Item key="2" onClick={onCropAction}><ScissorOutlined />裁剪</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <Card
        hoverable
        style={{ width: 96 }}
        onClick={onCardClick}
        cover={
          <img
            onDragStart={onImageDragStart}
            alt="example"
            src={page.thumbnail}
          />
        }
      >
        <span className={isSelected ? styles.selectText : undefined}>第{order}页</span>
      </Card>
    </Dropdown>
  );
}
