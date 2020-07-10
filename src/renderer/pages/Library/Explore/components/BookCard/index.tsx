import { Card, Dropdown, Menu } from 'antd';
import React from 'react';
import { ExportLibraryBook } from '@/pages/Library/Explore/module/config';
import { CheckOutlined } from '@ant-design/icons/lib';
import style from './style.less';

export interface BookCardPropsType {
  item: ExportLibraryBook,
  onSelect: () => void,
  onClick: () => void
}

const BookCard = ({ item, onSelect, onClick }: BookCardPropsType) => {
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={onSelect}><CheckOutlined/>选择</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <Card
        hoverable
        style={{ width: 150 }}
        onClick={onClick}
        cover={<img alt="example" src={item.cover}/>}
      >
        <Card.Meta title={<span className={item.isSelect ? style.titleSelected : undefined}>{item.name}</span>}/>
      </Card>
    </Dropdown>
  );
};
export default BookCard;
