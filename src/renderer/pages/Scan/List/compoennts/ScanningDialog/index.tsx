import React from 'react';
import { Modal, Spin } from 'antd';
import style from './style.less';
import { LoadingOutlined } from '@ant-design/icons/lib';

interface ScanningDialogPropsType {
  isOpen?:boolean
}


export default function ScanningDialog({isOpen=false}: ScanningDialogPropsType) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24,color:'white' }} spin />;

  return (
    <Modal
      visible={isOpen}
      footer={null}
      closable={false}
      maskClosable={false}
      wrapClassName={style.wrap}
      bodyStyle={{backgroundColor:"#535353",color:"white"}}
    >
      <Spin  indicator={antIcon} /><span className={style.message}>扫描中(完成时间取决于目录规模)</span>
    </Modal>
  );
}
