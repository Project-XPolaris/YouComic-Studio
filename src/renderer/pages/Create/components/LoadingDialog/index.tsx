import React from 'react';
import { Modal, Spin } from 'antd';
import style from './style.less';

interface LoadingDialogPropsType {
  isOpen:boolean
  message:string
}


export default function LoadingDialog({isOpen,message}: LoadingDialogPropsType) {
  return (
    <Modal
      maskClosable={false}
      visible={isOpen}
      footer={null}
      closable={false}
    >
      <Spin />
      <span className={style.message}>{message}</span>
    </Modal>
  );
}
