import React from 'react';

import styles from './style.less';
import { Drawer } from 'antd';

interface ScanOptionDrawerPropsType {
  isOpen?: boolean
  onClose:() => void
}


export default function ScanOptionDrawer(
  {
    isOpen = false,
    onClose
  }: ScanOptionDrawerPropsType) {

  return (
    <Drawer
      visible={isOpen}
      title="扫描器选项"
      onClose={onClose}
      placement="right"
    >

    </Drawer>
  );
}
