import React from 'react';
import { Modal, Spin } from 'antd';
import style from './style.less';

interface ScanningDialogPropsType {
  isOpen?:boolean
}


export default function ScanningDialog({isOpen=false}: ScanningDialogPropsType) {
  return (
    <Modal
      visible={isOpen}
      footer={null}
      closable={false}
      maskClosable={false}
    >
      <Spin /><span className={style.message}>扫描中(完成时间取决于目录规模)</span>
    </Modal>
  );
}
