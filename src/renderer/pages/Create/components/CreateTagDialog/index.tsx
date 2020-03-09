import React from 'react';
import { Form, Icon, Input, Modal } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';

interface CreateTagDialogPropsType {
  isOpen?:boolean
  onClose?:() => void
  form?:WrappedFormUtils
  onCreate:(name:string,type:string) => void
}

const  CreateTagDialog = ({ isOpen=false,onClose,form,onCreate }: CreateTagDialogPropsType) => {
  const {getFieldDecorator} = form;
  const onDialogOk = () => {
    form.validateFields((err, values:{name:string,type:string}) => {
      if (err) {
        return;
      }
      onCreate(values.name,values.type);
      form.resetFields();
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
      <Form>
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入标签名称' }],
          })(
            <Input
              prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="name"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请输入标签类型' }],
          })(
            <Input
              prefix={<Icon type="flag" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="type"
            />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Form.create({name:"create_tag"})(CreateTagDialog)
