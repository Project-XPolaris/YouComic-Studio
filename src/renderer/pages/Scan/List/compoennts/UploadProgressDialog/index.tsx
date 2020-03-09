import React from 'react';
import { Modal, Progress } from 'antd';
import noCover from '@/assets/no-cover.png';
import styles from './style.less';

interface UploadProgressDialogPropsType {
  isOpen?: boolean
  cover?: string
  currentInfo?:string
  title?:string
  currentPercent?:number
  totalPercent?:number
}


export default function UploadProgressDialog(
  {
    isOpen = false,
    currentInfo = "",
    title = "",
    totalPercent = 0,
    currentPercent = 0,
    cover = noCover
  }: UploadProgressDialogPropsType) {

  return (
    <Modal
      visible={isOpen}
      maskClosable={false}
      closable={false}
      footer={null}
    >
      <div className={styles.bookWrap}>
        <div className={styles.coverWrap}>
          <img src={cover} className={styles.cover}/>
        </div>
        <div className={styles.infoWrap}>
          <div className={styles.title}>
            {title}
          </div>
          <div>
            <Progress percent={currentPercent} className={styles.progress} />
          </div>
          <div>
            {currentInfo}
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div>
        Total:
        </div>
        <Progress percent={totalPercent} className={styles.totalProgress}/>
      </div>
    </Modal>
  );
}
