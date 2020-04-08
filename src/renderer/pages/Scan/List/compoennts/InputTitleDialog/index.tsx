import React from 'react';
import { Form, Input, Modal } from 'antd';

interface InputTitleDialogPropsType {
  isOpen: boolean;
  onOK: (title: string) => void;
  onCancel: () => void;
}

export default function InputTitleDialog({ isOpen, onCancel, onOK }: InputTitleDialogPropsType) {
  const [form] = Form.useForm();
  const onModalOk = () => {
    form.validateFields().then(values => {
      form.resetFields();
      onOK(values.title);
    });
  };
  return (
    <Modal title="设置标题" visible={isOpen} onOk={onModalOk} onCancel={onCancel}>
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="title"
          label="批量设置标题"
          rules={[{ required: true, message: 'Please input the title' }]}
        >
          <Input />
        </Form.Item>
      </Form>
      <p>可以在标题中使用通配符，不同的通配符会有不同的作用</p>
      <p>%index% 添加顺序标记，按照当前列表顺序</p>
    </Modal>
  );
}
