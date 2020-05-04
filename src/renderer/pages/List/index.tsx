import React from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { Button, PageHeader, Tabs } from 'antd';
import { history } from 'umi'
import SideTree from '@/pages/List/components/SideTree';
const { TabPane } = Tabs;

interface ListPagePropsType {
  dispatch: any,
  children
}

function ListPage({ dispatch,children }: ListPagePropsType) {
  const onBack = () => {
    history.goBack();
  };
  const  onCreateClick = () => {
    history.push("/book/create")
  };
  const actions = (
    <Button type="primary" onClick={onCreateClick}>创建</Button>
  );
  return (
    <div className={styles.main}>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={onBack}
        title={'文件列表'}
        extra={actions}
      />
      <div className={styles.content}>
        <div className={styles.side}>
          <SideTree/>
        </div>
        <div className={styles.fileContent}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default connect(({ fileList }:any) => ({ fileList }))(ListPage);
