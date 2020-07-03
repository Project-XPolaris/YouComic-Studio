import React from 'react';
import { Button, Col, Descriptions, Drawer, Dropdown, Menu, Row, Tag, Typography } from 'antd';
import styles from './style.less';
import MenuIcon from '@ant-design/icons/MenuOutlined';
import FileIcon from '@ant-design/icons/FileImageFilled';
import TagIcon from '@ant-design/icons/TagFilled';

const { Paragraph, Text } = Typography;

export interface PageItem {
  path: string;
}

interface BookQuickViewDrawerPropsType {
  onClose: () => void;
  visible: boolean;
  coverURL?: string;
  title?: string;
  artist?: string;
  theme?: string;
  dirname?: string;
  series?: string;
  translator?: string;
  pages: PageItem[];
  onInfoChange: (key: string, newValue: string) => void;
  onSelectCoverAction: () => void;
  onAddTag: () => void;
  extraTags: Array<{ name: string; type: string }>;
  onDeleteTag?: (name: string, type: string) => void;
}

export default function BookQuickViewDrawer({
                                              coverURL,
                                              title,
                                              artist,
                                              theme,
                                              series,
                                              translator,
                                              visible,
                                              onClose,
                                              pages,
                                              onInfoChange,
                                              onSelectCoverAction,
                                              onAddTag,
                                              dirname,
                                              extraTags = [],
                                              onDeleteTag,
                                            }: BookQuickViewDrawerPropsType) {
  const PageCollection = () => {
    return (
      <Row gutter={12} className={styles.pageRow}>
        {pages?.slice(0, 5).map(file => (
          <Col key={file.path} className={styles.pageItem}>
            <img src={file.path} className={styles.pageImage}/>
          </Col>
        ))}
      </Row>
    );
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={onSelectCoverAction}>
        <FileIcon/>
        设置封面
      </Menu.Item>
      <Menu.Item onClick={onAddTag} key="2">
        <TagIcon/>
        添加标签
      </Menu.Item>
    </Menu>
  );
  return (
    <Drawer title="快速预览" placement="right" visible={visible} width={480} onClose={onClose}>
      <div className={styles.main}>
        <div className={styles.header}>
          <Dropdown overlay={menu}>
            <Button type="primary">
              菜单 <MenuIcon/>
            </Button>
          </Dropdown>
        </div>
        <div className={styles.coverWrap}>
          {coverURL && <img src={coverURL} className={styles.cover}/>}
        </div>
        <Descriptions bordered={true} className={styles.infoWrap} column={1}>
          <Descriptions.Item label={'文件夹名称'}>
            <Text
              className={styles.editableText}
            >
              {dirname}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={'标题'}>
            <Text
              editable={{
                onChange: value => onInfoChange('title', value),
              }}
              className={styles.editableText}
            >
              {title}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="作者">
            <Text
              className={styles.editableText}
              editable={{
                onChange: value => onInfoChange('artist', value),
              }}
            >
              {artist}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={'主题'}>
            <Text
              className={styles.editableText}
              editable={{
                onChange: value => onInfoChange('theme', value),
              }}
            >
              {theme}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={'系列'}>
            <Text
              editable={{
                onChange: value => onInfoChange('series', value),
              }}
              className={styles.editableText}
            >
              {series}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={'翻译'}>
            <Text
              editable={{
                onChange: value => onInfoChange('translator', value),
              }}
              className={styles.editableText}
            >
              {translator}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={'其他标签'}>
            {extraTags.length !== 0 &&
            extraTags.map(tag => {
              return <Tag
                key={tag.name}
                closable={Boolean(onDeleteTag)}
                onClose={() => onDeleteTag(tag.name, tag.type)}
              >{tag.name}</Tag>;
            })}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Drawer>
  );
}
