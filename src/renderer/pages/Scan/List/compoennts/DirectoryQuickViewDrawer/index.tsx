import React from 'react';
import { Button, Card, Col, Descriptions, Drawer, Dropdown, Icon, Menu, Row, Tag, Typography } from 'antd';
import styles from './style.less';

const { Paragraph, Text } = Typography;

export interface PageItem {
  path: string
}

interface DirectoryQuickViewDrawerPropsType {
  onClose: () => void
  visible: boolean
  coverURL?: string
  title?: string
  artist?: string
  theme?: string
  series?: string
  translator?: string
  pages: PageItem[],
  onInfoChange: (key: string, newValue: string) => void,
  onSelectCoverAction: () => void
  onAddTag: () => void
  extraTags: Array<{ name: string, type: string }>
}


export default function DirectoryQuickViewDrawer(
  {
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
    extraTags = [],
  }: DirectoryQuickViewDrawerPropsType) {
  const PageCollection = () => {
    return (
      <Row gutter={12} type="flex" className={styles.pageRow}>
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
        <Icon type="file-image"/>
        设置封面
      </Menu.Item>
      <Menu.Item onClick={onAddTag} key="2">
        <Icon type="tags"/>
        添加标签
      </Menu.Item>
    </Menu>
  );
  return (
    <Drawer
      title="快速预览"
      placement="right"
      visible={visible}
      width={480}
      onClose={onClose}
    >
      <div className={styles.main}>
        <div className={styles.header}>
          <Dropdown overlay={menu}>
            <Button type="primary">
              菜单 <Icon type="menu"/>
            </Button>
          </Dropdown>
        </div>
        <div className={styles.coverWrap}>
          {coverURL && <img src={coverURL} className={styles.cover}/>}
        </div>
        <Descriptions bordered={true} className={styles.infoWrap} column={1}>
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
          <Descriptions.Item label='作者'>
            <Text
              className={styles.editableText}
              editable={{
                onChange: value => onInfoChange('artist', value),
              }}
            >{artist}
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
            </Text></Descriptions.Item>
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
            {
              extraTags.length !== 0 &&
              extraTags.map(tag => {
                return (
                  <Tag>{tag.name}</Tag>
                );
              })
            }
          </Descriptions.Item>

        </Descriptions>
      </div>
    </Drawer>
  );
}
