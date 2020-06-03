import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Col, Menu, PageHeader, Row } from 'antd';
import CheckIcon from '@ant-design/icons/CheckOutlined';
import styles from './style.less';
import YouComicPanel from '@/pages/Setting/panels/YouComicPanel';
import { history } from 'umi';

interface SettingPagePropsType {
  dispatch: any;
}

function SettingPage({ dispatch }: SettingPagePropsType) {
  const [selectKey, setSelectKey] = useState('1');
  const onApply = () => {
    dispatch({
      type: 'setting/applyOption',
    });
  };
  const actions = (
    <Button type={'primary'} onClick={onApply}>
      <CheckIcon /> 应用
    </Button>
  );
  const onBack = () => {
    history.goBack();
  };
  return (
    <div>
      <div className={styles.headerWrap}>
        <PageHeader
          onBack={onBack}
          title="设置"
          extra={actions}
        />

        <div className={styles.content}>
          <Row>
            <Col span={4}>
              <Menu mode={'inline'} className={styles.nav} selectedKeys={[selectKey]}>
                <Menu.Item key={'1'} onClick={() => setSelectKey('1')}>
                  YouComic
                </Menu.Item>
              </Menu>
            </Col>
            <Col span={20} className={styles.settingContent}>
              <div style={{ display: selectKey === '1' ? undefined : 'none' }}>
                <YouComicPanel />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default connect(({}) => ({}))(SettingPage);
