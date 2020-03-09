import React from 'react';
import { Card, Dropdown, Icon, Menu, Tag } from 'antd';
import style from './style.less';
import { Directory } from '@/pages/Scan/List/model';

interface DirectoryCardPropsType {
  directory: Directory
  onClick: (directory) => void
  isSelected?: boolean
  onCardSelect: (directory: Directory) => void
}


export default function DirectoryCard({ directory, isSelected = false, onCardSelect, ...props }: DirectoryCardPropsType) {
  const onCardClick = () => {
    props.onClick(directory);
  };
  const onContextMenuActionSelect = () => {
    onCardSelect(directory);
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={onContextMenuActionSelect}><Icon type="check"/> 选择</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <Card className={style.main} hoverable onClick={onCardClick}>
        <div className={style.left}>
          {
            directory.targetFiles.length > 0 &&
            <img src={directory.coverPath} className={style.cover}/>
          }
          <div className={style.infoWrap}>
            {directory.matchInfo &&
            <div className={isSelected ? style.titleSelected : style.title}>{directory.matchInfo.title}</div>}
            {directory.matchInfo &&
            <Tag color="#108ee9" className={style.tag}><Icon type="user"/>{directory.matchInfo.artist}</Tag>}
            <div>
              {directory.matchInfo && directory.matchInfo.theme &&
              <Tag color="#108ee9" className={style.tag}> <Icon type="smile"/>{directory.matchInfo.theme}</Tag>}
              {directory.matchInfo && directory.matchInfo.series &&
              <Tag color="#108ee9" className={style.tag}><Icon type="book"/>{directory.matchInfo.series}</Tag>}
              {directory.matchInfo && directory.matchInfo.translator &&
              <Tag color="#108ee9" className={style.tag}><Icon type="global"/>{directory.matchInfo.translator}</Tag>}
              {directory?.extraTags?.map(extraTag => {
                return (
                  <Tag key={extraTag.name} className={style.tag}><Icon type="tag"/>{extraTag.name}</Tag>
                );
              })}
            </div>
            <div className={style.directoryName}>{directory.name}</div>
          </div>
        </div>
      </Card>
    </Dropdown>
  );
}
