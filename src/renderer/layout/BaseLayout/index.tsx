import React from 'react';
import styles from './style.less';
import ProLayout from '@ant-design/pro-layout';
import { connect } from 'dva';
import BlankLayout from '@/layout/BlankLayout';

interface BaseLayoutPropsType {
  children: any;
}

const BaseLayout = ({ children }: BaseLayoutPropsType) => {
  return (
    <BlankLayout>
      <ProLayout className={styles.main}>{children}</ProLayout>
    </BlankLayout>
  );
};
export default connect(({ user }) => ({ user }))(BaseLayout);
