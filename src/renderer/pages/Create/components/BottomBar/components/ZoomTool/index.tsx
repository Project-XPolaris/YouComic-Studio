import React from 'react';
import styles from './style.less';
import { Radio, Tooltip } from 'antd';
import { ExpandOutlined, FullscreenExitOutlined, OneToOneOutlined } from '@ant-design/icons/lib';
import { RadioChangeEvent } from 'antd/es/radio';

export enum ZoomMode {
  Fit = 'fit', Original = 'original', Small = 'small'
}

export interface ZoomToolPropsType {
  onZoomModeChange: (mode: ZoomMode) => void
}


export default function ZoomTool({ onZoomModeChange }: ZoomToolPropsType) {
  const zoomRadioChange = (e: RadioChangeEvent) => {
    onZoomModeChange(e.target.value);
  };
  return (
    <div>
      <Radio.Group defaultValue="fit" size="small" onChange={zoomRadioChange}>
        <Tooltip title="合适大小">
          <Radio.Button value="fit"><ExpandOutlined/></Radio.Button>
        </Tooltip>
        <Tooltip title="原始比例">
          <Radio.Button value="original"><OneToOneOutlined/></Radio.Button>
        </Tooltip>
        <Tooltip title="缩小显示">
          <Radio.Button value="small"><FullscreenExitOutlined/></Radio.Button>
        </Tooltip>
      </Radio.Group>
    </div>
  );
}
