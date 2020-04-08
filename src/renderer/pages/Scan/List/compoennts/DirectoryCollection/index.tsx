import React from 'react';
import { Col, Empty, Row } from 'antd';
import style from './style.less';
import { Directory } from '@/pages/Scan/List/model';
import DirectoryCard from '@/pages/Scan/List/compoennts/DirectoryCard';

interface DirectoryCollectionPropsType {
  directoryList?: Directory[];
  onCardClick: (directory: Directory) => void;
  selectedDirectory?: string[];
  onSelectedDirectoryUpdate: (newSelectedDirectory: string[]) => void;
}

export default function DirectoryCollection({
  directoryList,
  onCardClick,
  selectedDirectory,
  onSelectedDirectoryUpdate,
}: DirectoryCollectionPropsType) {
  const empty = (
    <div className={style.emptyWrap}>
      <Empty />
    </div>
  );
  const items = directoryList.map(item => {
    const isSelected = Boolean(selectedDirectory.find(selectItem => selectItem === item.path));
    const onCardSelect = (selectDirectory: Directory) => {
      if (isSelected) {
        onSelectedDirectoryUpdate(selectedDirectory.filter(path => path !== item.path));
      } else {
        onSelectedDirectoryUpdate([...selectedDirectory, item.path]);
      }
    };
    return (
      <Col span={24} key={item.path}>
        <DirectoryCard
          directory={item}
          onClick={onCardClick}
          isSelected={isSelected}
          onCardSelect={onCardSelect}
        />
      </Col>
    );
  });
  return (
    <div className={style.main}>{directoryList.length === 0 ? empty : <Row>{items}</Row>}</div>
  );
}
