import React from 'react';
import { Modal, Progress } from 'antd';
import style from './style.less';

interface ImportImageDialogPropsType {
  isOpen: boolean,
  fileName: string,
  progress: number,
  total: number,
  current:number
}


export default function ImportImageDialog({ isOpen, fileName, progress, total,current }: ImportImageDialogPropsType) {
  return (
    <Modal
      visible={isOpen}
      closable={false}
      maskClosable={false}
      footer={null}
    >
      <Progress percent={progress} status="active"/>
      <div>
        <span className={style.label}>正在导入:</span>
        {`${fileName}     (${current} of ${total})`}
      </div>
    </Modal>
  );
}
