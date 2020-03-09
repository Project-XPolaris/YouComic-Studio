import React from 'react';
import { Card, Dropdown, Icon, Menu } from 'antd';
import { Page } from '@/pages/Create/model';
import styles from './style.less';

interface PageItemPropsType {
  page: Page
  order: number
  onClick: (page: Page) => void
  onSelect: (page: Page) => void
  isSelected?: boolean
}


export default function PageItem({ page, order, onClick, onSelect, isSelected = false }: PageItemPropsType) {
  const onImageDragStart = (e: any) => {
    e.preventDefault();
  };
  const onCardClick = () => {
    onClick(page);
  };
  const onSelectAction = () => {
    onSelect(page);
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={onSelectAction}><Icon type="check"/>选中</Menu.Item>
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
