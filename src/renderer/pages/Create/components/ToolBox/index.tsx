import React from 'react';
import { Button, Divider } from 'antd';
import { BorderlessTableOutlined, DragOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons/lib';
import styles from './style.less';

interface ToolBoxPropsType {
  enterCropMode:() => void
}


export default function ToolBox({enterCropMode}: ToolBoxPropsType) {

  return (
    <div>
      <div className={styles.actionButtonWrap}>
        <Button
          icon={<DragOutlined />}
          type={'link'}
          shape={'circle'}
          className={styles.actionButton}
          onClick={(e) => e.preventDefault()}
        />
      </div>
      <Divider className={styles.divider}/>
      <div className={styles.actionButtonWrap}>
        <Button
          icon={<BorderlessTableOutlined/>}
          type={'link'}
          shape={'circle'}
          className={styles.actionButton}
          onClick={enterCropMode}
        />
      </div>
      <Divider className={styles.divider}/>
      <div className={styles.actionButtonWrap}>
        <Button
          icon={<ZoomInOutlined/>}
          type={'link'}
          shape={'circle'}
          className={styles.actionButton}
          onClick={(e) => e.preventDefault()}
        />
      </div>
      <div className={styles.actionButtonWrap}>
        <Button
          icon={<ZoomOutOutlined/>}
          type={'link'}
          shape={'circle'}
          className={styles.actionButton}
          onClick={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}
