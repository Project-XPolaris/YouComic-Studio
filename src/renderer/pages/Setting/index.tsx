import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Col, Icon, Menu, PageHeader, Row } from 'antd';

import styles from './style.less';
import SubMenu from 'antd/es/menu/SubMenu';
import YouComicPanel from '@/pages/Setting/panels/YouComicPanel';
import { router } from 'umi';


interface SettingPagePropsType {
  dispatch: any,
}

function SettingPage({ dispatch }: SettingPagePropsType) {
  const [selectKey,setSelectKey] = useState("1")
  const onApply = () => {
    dispatch({
      type:"setting/applyOption"
    })
  }
  const actions = (
    <Button type={'primary'} onClick={onApply}><Icon type={"check"} /> 应用</Button>
  )
  const onBack = () => {
    router.goBack()
  }
  return (
    <div>
      <div className={styles.headerWrap}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          onBack={onBack}
          title="设置"
          extra={actions}
        />

        <div className={styles.content}>
          <Row>
            <Col span={4}>
              <Menu
                mode={'inline'}
                className={styles.nav}
                selectedKeys={[selectKey,]}
              >
                <Menu.Item key={"1"} onClick={() => setSelectKey("1")}><Icon type={"cloud"} />YouComic</Menu.Item>
              </Menu>
            </Col>
            <Col span={20} className={styles.settingContent}>
              <div style={{display:selectKey === "1"?undefined:"none"}}>
                <YouComicPanel/>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default connect(({}) => ({}))(SettingPage);
