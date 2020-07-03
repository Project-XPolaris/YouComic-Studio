import { connect } from '@@/plugin-dva/exports';
import React from 'react';
import { Button, Dropdown, Menu, PageHeader } from 'antd';
import { ExploreLibraryModelStateType } from '@/pages/Library/Explore/model';
import styles from './style.less';
import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  DownOutlined, MenuOutlined,
  ReloadOutlined,
} from '@ant-design/icons/lib';

const ExploreLibraryHeader =
  ({
     exploreLibrary,
    dispatch
   }: {
    exploreLibrary: ExploreLibraryModelStateType,
    dispatch:any
  }) => {
    const multipleSelectMenu = (
      <Menu>
        <Menu.Item key="1" onClick={() => dispatch({type:"exploreLibrary/selectAllBook"})}>
          <CheckSquareOutlined/>全选
        </Menu.Item>
        <Menu.Item key="2" onClick={() => dispatch({type:"exploreLibrary/unselectAllBook"})}>
          <CloseCircleOutlined/>不选
        </Menu.Item>
        <Menu.Item key="3" onClick={() => dispatch({type:"exploreLibrary/reverseSelectAllBook"})}>
          <ReloadOutlined/>反选
        </Menu.Item>
      </Menu>
    );
    const menu = (
      <Menu>

      </Menu>
    );
    const renderExtraButton = () => {
      return (
        <>

          {
            exploreLibrary.books.find(item => item.isSelect) !== undefined &&
            <Dropdown overlay={multipleSelectMenu}>
              <Button>
                多项操作 <CheckCircleOutlined/>
              </Button>
            </Dropdown>

          }
          <Dropdown overlay={menu}>
            <Button type={'primary'}>
              菜单 <MenuOutlined />
            </Button>
          </Dropdown>
        </>
      );
    };
    return (
      <PageHeader
        className={styles.root}
        onBack={() => history.back()}
        title={exploreLibrary.title}
        subTitle={exploreLibrary.subtitle}
        extra={renderExtraButton()}
      />
    );
  };

export default connect(({ exploreLibrary }: any) => ({ exploreLibrary }))(ExploreLibraryHeader);