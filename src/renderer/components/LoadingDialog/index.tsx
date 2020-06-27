import React from 'react';
import { Modal, Spin } from 'antd';
import style from './style.less';
import { LoadingOutlined } from '@ant-design/icons/lib';

interface ScanningDialogPropsType {
  isOpen?: boolean
  text?: string
}


export default function LoadingDialog({ isOpen = false, text = '处理中' }: ScanningDialogPropsType) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin/>;

  return (
    <Modal
      visible={isOpen}
      footer={null}
      closable={false}
      maskClosable={false}
    >
      <Spin indicator={antIcon}/><span className={style.message}>{text}</span>
    </Modal>
  );
}
