import React from 'react';
import { Modal, Typography } from 'antd';
import FolderIcon from '@ant-design/icons/FolderFilled';
import Search from 'antd/es/input/Search';
import styles from './style.less';
const { Title } = Typography;

interface CreateNewProjectDialogPropsType {
  isOpen: boolean;
  onOk: () => void;
  onClose: () => void;
  onSelectSaveFolder: () => void;
  path: string;
}

export default function CreateNewProjectDialog({
  isOpen = false,
  onOk,
  onClose,
  onSelectSaveFolder,
  path,
}: CreateNewProjectDialogPropsType) {
  return (
    <Modal closable={false} onCancel={onClose} onOk={onOk} visible={isOpen}>
      <Title level={4}>创建项目</Title>
      <Search
        placeholder="选择项目保存位置"
        enterButton={<FolderIcon />}
        onSearch={onSelectSaveFolder}
        className={styles.input}
        value={path}
      />
    </Modal>
  );
}
