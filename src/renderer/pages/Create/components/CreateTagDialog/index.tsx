import React from 'react';
import { Form, Input, Modal } from 'antd';

interface CreateTagDialogPropsType {
  isOpen?: boolean;
  onClose?: () => void;
  onCreate: (name: string, type: string) => void;
}

const CreateTagDialog = ({ isOpen = false, onClose, onCreate }: CreateTagDialogPropsType) => {
  const [form] = Form.useForm();
  const onDialogOk = () => {
    form.validateFields().then(values => {
      form.resetFields();
      onCreate(values.name, values.type);
    });
  };
  return (
    <Modal
      visible={isOpen}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      onOk={onDialogOk}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateTagDialog;
