import React from 'react';
import { User } from '@/services/youcomic/model';
import { Button, Dropdown, Menu } from 'antd';
import UserIcon from '@ant-design/icons/UserOutlined';
import LogoutIcon from '@ant-design/icons/LogoutOutlined';

interface AccountButtonPropsType {
  user?: User;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AccountButton({ user, onLogin, onLogout }: AccountButtonPropsType) {
  if (user) {
    const menu = (
      <Menu>
        <Menu.Item onClick={onLogout}>
          <LogoutIcon />
          登出
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <Button>
          <UserIcon />
          {user.nickname}
        </Button>
      </Dropdown>
    );
  } else {
    return (
      <Button onClick={onLogin}>
        <UserIcon />
        登录至YouComic
      </Button>
    );
  }
}
