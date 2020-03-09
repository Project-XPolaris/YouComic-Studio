import React from 'react';
import { Icon, Modal, Progress } from 'antd';
import style from './style.less';

interface AutoImportProgressDialogPropsType {
  isOpen: boolean
  progress: number
  message: string
}


export default function AutoImportProgressDialog({ isOpen = false, progress, message }: AutoImportProgressDialogPropsType) {
  return (
    <Modal
      visible={isOpen}
      maskClosable={false}
      footer={null}
      closable={false}
    >
      <Progress percent={progress}/>
      <Icon type="loading"/> <span>{message}</span>
    </Modal>
  );
}
