import React, { createRef, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop from 'react-image-crop';
import styles from './style.less';
import { Modal } from 'antd';

interface CropDialogPropsType {
  onOk: (x: number, y: number, height: number, width: number, cropWidth: number, cropHeight: number) => void
  src: string
  isOpen?: boolean
  onCancel:() => void
}


export default function CropDialog({ onOk, src, isOpen=false ,onCancel}: CropDialogPropsType) {
  const [crop, setCrop] = useState<any>();
  const containerRef = useRef<HTMLDivElement>();
  const onConfirm = () => {
    const { x, y, width, height } = crop;
    onOk(x, y, width, height, containerRef.current.offsetWidth, containerRef.current.offsetHeight);
  };
  const onCropChange = (newCrop) => {
    console.log(newCrop);
    setCrop(newCrop);
  };
  return (
    <div>
      <Modal visible={isOpen} closable={false} onOk={onConfirm} onCancel={onCancel}>
        <div>
          <div ref={containerRef} className={styles.cropContainer}>
            <ReactCrop
              src={src}
              crop={crop} onChange={onCropChange}/>
          </div>
        </div>
      </Modal>
    </div>
  );
}
