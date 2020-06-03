import React from 'react';
import styles from './style.less';
import { Page } from '@/pages/Create/model';
import { Button, Card, Dropdown, Menu } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  CheckOutlined,
  DeleteOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons/lib';
import classNames from 'classnames';

interface SidePagesContainerPropsType {
  pages?: Page[]
  onPageClick: (page: Page) => void
  onAppendPage: () => void
  onDeletePage: (page: Page) => void
  onInsertPage: (index: number) => void
  selectPagePath?: any[]
  onAddSelect: (page: Page) => void
}


export default function SidePagesContainer({ pages = [], onPageClick, onAppendPage, onDeletePage, onInsertPage, selectPagePath = [], onAddSelect }: SidePagesContainerPropsType) {
  return (
    <div>
      {pages.map((page: Page, idx) => {
        const isSelected = Boolean(selectPagePath.find(selectedPage => selectedPage.path === page.path));
        const onCardClick = () => {
          onPageClick(page);
        };
        const onDeleteAction = () => {
          onDeletePage(page);
        };
        const onAddBeforeAction = () => {
          const index = pages.findIndex((elm: Page) => page.path === elm.path);
          if (index !== -1) {
            if (index === 0) {
              onInsertPage(0);
              return;
            }
            onInsertPage(idx - 1);
          }
        };
        const onAddAfterAction = () => {
          const index = pages.findIndex((elm: Page) => page.path === elm.path);
          if (index !== -1) {
            onInsertPage(idx);
          }
        };
        const onSelectAction = () => {
          onAddSelect(page);
        };
        const menu = (
          <Menu>
            <Menu.Item key="action_select" onClick={onSelectAction}><CheckOutlined/>选中</Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="action_delete" onClick={onDeleteAction}><DeleteOutlined/>删除页面</Menu.Item>
            <Menu.Divider/>
            <Menu.SubMenu title={'插入'}>
              <Menu.Item key="action_push" onClick={onAddBeforeAction}><VerticalAlignTopOutlined/>在此页面前添加</Menu.Item>
              <Menu.Item key="action_append"
                         onClick={onAddAfterAction}><VerticalAlignBottomOutlined/>在此页面后添加</Menu.Item>
            </Menu.SubMenu>

          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={['contextMenu']} key={page.path}>
            <Card
              size={'small'}
              hoverable={true}
              className={isSelected ? styles.cardSelected : styles.card}
              onClick={onCardClick}

            >
              <img src={page.thumbnail} style={{ width: 120 }}/>
              <div className={styles.pageIndicator}>
                {idx + 1}
              </div>
            </Card>
          </Dropdown>
        );
      })}
      <Button icon={<PlusOutlined/>} onClick={onAppendPage}>
        添加新页面
      </Button>
    </div>
  );
}
