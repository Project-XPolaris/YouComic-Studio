import React from 'react';
import { Card, Dropdown, Menu, Tag } from 'antd';
import style from './style.less';
import { Directory } from '@/pages/Scan/List/model';
import SelectIcon from '@ant-design/icons/CheckOutlined';
import UserIcon from '@ant-design/icons/UserOutlined';
import SmileIcon from '@ant-design/icons/SmileOutlined';
import GlobalIcon from '@ant-design/icons/GlobalOutlined';
import BookIcon from '@ant-design/icons/BookFilled';
import TagIcon from '@ant-design/icons/TagFilled';

interface DirectoryCardPropsType {
  directory: Directory;
  onClick: (directory) => void;
  isSelected?: boolean;
  onCardSelect: (directory: Directory) => void;
}

export default function DirectoryCard({
  directory,
  isSelected = false,
  onCardSelect,
  ...props
}: DirectoryCardPropsType) {
  const onCardClick = () => {
    props.onClick(directory);
  };
  const onContextMenuActionSelect = () => {
    onCardSelect(directory);
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={onContextMenuActionSelect}>
        <SelectIcon /> 选择
      </Menu.Item>
    </Menu>
  );
  const { title = '未知' } = directory;
  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <Card className={style.main} hoverable onClick={onCardClick}>
        <div className={style.left}>
          {directory.targetFiles.length > 0 && (
            <img src={directory.coverPath} className={style.cover} />
          )}
          <div className={style.infoWrap}>
            <div className={isSelected ? style.titleSelected : style.title}>{title}</div>
            {directory.matchInfo && directory.matchInfo.artist && (
              <Tag color="#108ee9" className={style.tag}>
                <UserIcon />
                {directory.matchInfo.artist}
              </Tag>
            )}
            <div>
              {directory.matchInfo && directory.matchInfo.theme && (
                <Tag color="#108ee9" className={style.tag}>
                  {' '}
                  <SmileIcon />
                  {directory.matchInfo.theme}
                </Tag>
              )}
              {directory.matchInfo && directory.matchInfo.series && (
                <Tag color="#108ee9" className={style.tag}>
                  <BookIcon />
                  {directory.matchInfo.series}
                </Tag>
              )}
              {directory.matchInfo && directory.matchInfo.translator && (
                <Tag color="#108ee9" className={style.tag}>
                  <GlobalIcon />
                  {directory.matchInfo.translator}
                </Tag>
              )}
              {directory?.extraTags?.map(extraTag => {
                return (
                  <Tag key={extraTag.name} className={style.tag}>
                    <TagIcon />
                    {extraTag.name}
                  </Tag>
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
