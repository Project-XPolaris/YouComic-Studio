import React, { ChangeEvent, useState } from 'react';
import { Icon, Input, Modal, Typography } from 'antd';
import styles from './style.less'
const { Title } = Typography;

interface LoginDialogPropsType {
  isOpen?: boolean
  onClose: () => void
  onOk: (username:string,password:string) => void
}


export default function LoginDialog(
  {
    isOpen = false,
    onClose,
    onOk,
  }: LoginDialogPropsType) {
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const onUsernameChange = (e:ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  const onPasswordChange = (e:ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const onDialogOk = () => {
    setUsername("")
    setPassword("")
    onOk(username,password)
  }
  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      onOk={onDialogOk}
      closable={false}
    >
      <Title level={4}>登录至YouComic</Title>
      <Input
        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
        placeholder={"用户名"}
        className={styles.input}
        onChange={onUsernameChange}
        value={username}
      />
      <Input
        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
        placeholder={"密码"}
        className={styles.input}
        onChange={onPasswordChange}
        type="password"
        value={password}
      />
    </Modal>
  );
}
