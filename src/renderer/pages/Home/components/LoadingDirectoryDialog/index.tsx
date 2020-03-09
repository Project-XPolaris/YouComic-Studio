import React from 'react';
import { Modal, Spin } from 'antd';
import style from './style.less';

interface LoadingDirectoryDialogPropsType {
  isOpen:boolean
}


export default function LoadingDirectoryDialog({isOpen}: LoadingDirectoryDialogPropsType) {
  return (
    <Modal
      maskClosable={false}
      visible={isOpen}
      footer={null}
      closable={false}
    >
      <Spin />
      <span className={style.message}>读取目录中</span>
    </Modal>
  );
}
