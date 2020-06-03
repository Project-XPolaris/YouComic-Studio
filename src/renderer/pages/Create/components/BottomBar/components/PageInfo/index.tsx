import React from 'react';
import styles from './style.less';
import { Divider } from 'antd';

export interface PageInfoItem {
  name: string
  value?: string
}

export interface PageInfoPropsType {
  infoItems?: PageInfoItem[]
}


export default function PageInfo({ infoItems = [] }: PageInfoPropsType) {
  return (
    <div className={styles.root}>
      {infoItems.map((item: PageInfoItem, index: number) => (
        <div key={index}>
          {item.name} : {item.value}
          {index !== infoItems.length - 1 && <Divider type={'vertical'}/>}
        </div>
      ))}
    </div>
  );
}
