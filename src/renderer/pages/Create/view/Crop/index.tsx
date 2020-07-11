import React, { useRef, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { CreateBookModelStateType } from '@/pages/Create/model';
import styles from './style.less';
import ReactCrop from 'react-image-crop';
import { Button, Card, Divider, Input, Radio } from 'antd';
import {
  BorderBottomOutlined,
  BorderLeftOutlined,
  BorderRightOutlined,
  BorderTopOutlined,
} from '@ant-design/icons/lib';
import { RadioChangeEvent } from 'antd/es/radio';
import { getCurrentDisplayPageSrc, getImageWidth } from '@/pages/Create/helpers';


interface CropViewPropsType {
  dispatch: Dispatch,
  create: CreateBookModelStateType
  onExitMode: () => void
}

function CropView({ dispatch, create, onExitMode }: CropViewPropsType) {
  const [crop, setCrop] = useState<any>();
  const [customRatio, setCustomRatio] = useState({ width: 1, height: 1 });
  const [cropMode, setCropMode] = useState('free');
  const cropRef = useRef<HTMLDivElement>();
  const originRatio = () => {
    setCrop({ aspect: cropRef.current.imageRef.offsetWidth / cropRef.current.imageRef.offsetHeight });
  };
  const onCropModeChange = (e: RadioChangeEvent) => {
    setCropMode(e.target.value);
    if (e.target.value === 'origin') {
      originRatio();
    } else if (e.target.value === 'free') {
      setCrop({});
    } else if ('ratio') {
      setCrop({ aspect: customRatio.width / customRatio.height });
    }
  };
  const onApplyCrop = () => {
    if (crop.x === 0 || crop.y === 0 || crop.width === 0 || crop.heigh > 0) {
      return;
    }
    dispatch({
      type: 'create/cropPage',
      payload: {
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height,
        cropWidth: cropRef.current.imageRef.offsetWidth,
        cropHeight: cropRef.current.imageRef.offsetHeight,
      },
    });
    onExitMode();
  };
  return (
    <div style={{width:"100%",flexGrow:1,display:"flex",position:"relative"}}>
      <div style={{width:"100%",justifyContent:"center",alignItems:"center",display:"flex"}}>
      <div style={{width:getImageWidth(create),marginTop:90,marginBottom:90}}>
        {
          create.currentImageName &&
          <ReactCrop
            src={getCurrentDisplayPageSrc(create)}
            crop={crop}
            onChange={(crop) => setCrop(crop)}
            ref={cropRef}
          />
        }
      </div>
      </div>
      <Card className={styles.cropInfoWindow}>
        <div className={styles.infoWindowTitle}>裁剪</div>
        <div>
          <div className={styles.valueField}>
            <BorderTopOutlined/>
            <Input className={styles.inputValue} size={'small'} value={crop?.y}/>
            <Button
              size={'small'}
              type={'primary'}
              className={styles.inputValueButton}
              onClick={() => setCrop({ ...crop, y: 0, height: crop.height + crop.y })}
            >
              最大
            </Button>
          </div>
          <div className={styles.valueField}>
            <BorderLeftOutlined/>
            <Input className={styles.inputValue} size={'small'} value={crop?.x}/>
            <Button
              size={'small'}
              type={'primary'}
              className={styles.inputValueButton}
              onClick={() => setCrop({ ...crop, x: 0, width: crop.width + crop.x })}
            >最大</Button>
          </div>
          <div className={styles.valueField}>
            <BorderBottomOutlined/>
            <Input className={styles.inputValue} size={'small'} value={crop?.y + crop?.height}/>
            <Button
              size={'small'}
              type={'primary'}
              className={styles.inputValueButton}
              onClick={() => setCrop({ ...crop, height: cropRef.current.imageRef.offsetHeight - crop.y })}
            >最大</Button>
          </div>
          <div className={styles.valueField}>
            <BorderRightOutlined/>
            <Input className={styles.inputValue} size={'small'} value={crop?.x + crop?.width}/>
            <Button
              size={'small'}
              type={'primary'}
              className={styles.inputValueButton}
              onClick={() => setCrop({ ...crop, width: cropRef.current.imageRef.offsetWidth - crop.x })}
            >最大</Button>
          </div>
        </div>
        <Divider/>
        <div>
          <div className={styles.field}>
            <div className={styles.fieldTitle}>裁剪模式</div>
            <Radio.Group defaultValue="free" buttonStyle="solid" onChange={onCropModeChange} value={cropMode}>
              <Radio.Button value="free" className={styles.cropModeButton}>自由裁剪</Radio.Button>
              <Radio.Button value="ratio">比例裁剪</Radio.Button>
              <Radio.Button value="origin">原始比例</Radio.Button>
            </Radio.Group>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldTitle}>比例缩放</div>
            <div className={styles.ratioOption}>
              <Input
                value={customRatio.width}
                onChange={
                  (e) => {
                    setCustomRatio({ width: Number(e.target.value), height: customRatio.height });
                    if (cropMode === 'ratio') {
                      setCrop({ aspect: Number(e.target.value) / customRatio.height });
                    }
                  }
                }
              /> <span>:</span>
              <Input
                value={customRatio.height}
                onChange={
                  (e) => {
                    if (cropMode === 'ratio') {
                      setCustomRatio({ width: customRatio.width, height: Number(e.target.value) });
                      setCrop({ aspect: customRatio.width / Number(e.target.value) });
                    }
                  }
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.actionContainer}>
          <Button type={'primary'} className={styles.applyButton} onClick={onApplyCrop}>应用</Button>
          <Button type={'primary'} className={styles.cancelButton} onClick={onExitMode}>取消</Button>
        </div>
      </Card>
    </div>
  );
}

export default connect(({ create }: any) => ({ create }))(CropView);
