import React from 'react';
import styles from './style.less';
import { User } from '@/services/youcomic/model';
import { Button, Dropdown, Icon, Menu } from 'antd';

interface AccountButtonPropsType {
  user?: User
  onLogin:() => void
  onLogout:() => void
}


export default function AccountButton({ user,onLogin,onLogout }: AccountButtonPropsType) {
  if (user) {
    const menu = (
      <Menu>
        <Menu.Item onClick={onLogout}><Icon type="export"/>登出</Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <Button><Icon type={'user'}/>{user.nickname}</Button>
      </Dropdown>
    );
  } else {
    return (
      <Button onClick={onLogin}><Icon type={'user'}/>登录至YouComic</Button>
    );
  }
}
