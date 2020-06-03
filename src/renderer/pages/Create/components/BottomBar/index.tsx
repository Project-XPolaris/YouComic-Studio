import React from 'react';
import styles from './style.less';
import ZoomTool, { ZoomToolPropsType } from './components/ZoomTool';
import PageInfo, { PageInfoPropsType } from './components/PageInfo';

export interface BottomBarPropsType {
  zoomTool: ZoomToolPropsType
  pageInfo: PageInfoPropsType
}


export default function BottomBar({ zoomTool, pageInfo }: BottomBarPropsType) {
  return (
    <div className={styles.root}>
      <div>
        <PageInfo {...pageInfo}/>
      </div>
      <div>
        <ZoomTool {...zoomTool}/>
      </div>
    </div>
  );
}
