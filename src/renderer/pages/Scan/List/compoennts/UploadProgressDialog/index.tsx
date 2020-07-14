import React from 'react';
import { Button, Modal, Progress } from 'antd';
import noCover from '@/assets/no-cover.png';
import styles from './style.less';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib';
import { stopUpload } from '@/pages/Scan/List/modules/upload';

const {confirm} = Modal
interface UploadProgressDialogPropsType {
  isOpen?: boolean;
  cover?: string;
  currentInfo?:string;
  title?:string;
  currentPercent?:number;
  totalPercent?:number;
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

  const onCancelClick = () => {
    confirm({
      title: '取消上传',
      icon: <ExclamationCircleOutlined />,
      content: '已上传的将不会改变，将会停止上传。',
      onOk() {
        stopUpload()
      },
    });
  }
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
      <div className={styles.cancelButton}>

        <Button type={"primary"} color={"warn"} block onClick={onCancelClick}>取消</Button>
      </div>
    </Modal>
  );
}
