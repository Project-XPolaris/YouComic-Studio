import React, { ChangeEvent } from 'react';
import { Input, Typography } from 'antd';
import styles from './style.less';

const { Title } = Typography;


interface TextInputSectionPropsType {
  title: string
  onValueChane: (value: string) => void
  value: string
}


export default function TextInputSection({ title, onValueChane, value }: TextInputSectionPropsType) {
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onValueChane(e.target.value);
  };
  return (
    <div>
      <div className={styles.title}>{title}</div>
      <Input onChange={onInputChange} value={value}/>
    </div>
  );
}
