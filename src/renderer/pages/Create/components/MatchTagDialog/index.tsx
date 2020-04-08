import React, { useState } from 'react';
import { Icon, Modal, Tag } from 'antd';
import style from './style.less';
import { matchTagInfo } from '@/utils/match';

interface MatchTagDialogPropsType {
  isOpen: boolean;
  text: string;
  onOk: (tags, title?: string) => void;
  onClose: () => void;
}

const infoTypeToIcon = {
  artist: 'user',
  series: 'book',
  theme: 'smile',
  translator: 'global',
};
const { CheckableTag } = Tag;

export default function MatchTagDialog({
  isOpen,
  text = '',
  onOk,
  onClose,
}: MatchTagDialogPropsType) {
  const matchResult = matchTagInfo(text);
  const [selectTags, setSelectTags] = useState([]);
  const [selectTitle, setSelectTitle] = useState<string | undefined>(undefined);
  const renderMatchTag = () => {
    if (matchResult === undefined || matchResult === null) {
      return undefined;
    }
    return Object.getOwnPropertyNames(matchResult).map(type => {
      if (type === 'title') {
        return undefined;
      }
      const onSelectChange = (isSelect: boolean) => {
        if (isSelect) {
          setSelectTags([...selectTags, { name: matchResult[type], type }]);
        } else {
          setSelectTags(selectTags.filter(tag => tag.name !== matchResult[type]));
        }
      };
      return (
        <CheckableTag
          onChange={onSelectChange}
          checked={selectTags.find(tag => tag.name === matchResult[type]) !== undefined}
          key={type}
          className={style.infoTag}
        >
          <Icon type={infoTypeToIcon[type]} className={style.tagTypeIcon} />
          {matchResult[type]}
        </CheckableTag>
      );
    });
  };
  const renderMatchTitle = () => {
    if (matchResult === undefined || matchResult === null || !('title' in matchResult)) {
      return undefined;
    }
    const onSelectChange = (isSelect: boolean) => {
      setSelectTitle(isSelect ? matchResult.title : undefined);
    };
    return (
      <div>
        <div className={style.itemTitle}>
          标题
          <Icon type="book" />
        </div>
        <CheckableTag
          onChange={onSelectChange}
          checked={selectTitle !== undefined}
          className={style.infoTag}
        >
          {matchResult.title}
        </CheckableTag>
      </div>
    );
  };
  const onDialogOk = () => {
    onOk(selectTags, selectTitle);
  };
  return (
    <Modal
      visible={isOpen}
      closable={false}
      maskClosable={false}
      onOk={onDialogOk}
      onCancel={onClose}
    >
      <div className={style.itemTitle}>识别字符</div>
      {text}
      {renderMatchTitle()}
      <div className={style.itemTitle}>
        标签
        <Icon type="tags" />
      </div>
      {renderMatchTag()}
    </Modal>
  );
}
