import React from 'react';
import { Tag as BookTag } from '@/pages/Create/model';
import { Tag } from 'antd';

interface TagCollectionPropsType {
  tags?: BookTag[]
  onDeleteTag:(tag:BookTag) => void
}


export default function TagCollection({ tags = [],onDeleteTag }: TagCollectionPropsType) {
  const renderTags = () => {
    return tags.map((tag: BookTag,idx:number) => {
      const onCloseTag = () => {
        onDeleteTag(tag)
      };
      return (
        <Tag color="#108ee9" key={idx} onClose={onCloseTag} closable>{tag.name}</Tag>
      );
    });
  };
  return (
    <span>
      {renderTags()}
    </span>
  );
}
