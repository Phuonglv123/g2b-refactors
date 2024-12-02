import { updateAvatarForUser } from '@/services/user';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { ModalForm, ProFormUploadButton } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Spin, message } from 'antd';
import { createStyles } from 'antd-style';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.username}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

const ModalUpdateAvatar = ({ visible }: any) => {
  return (
    <ModalForm
      open={visible}
      title="Update Avatar"
      width={400}
      modalProps={{
        centered: true, // Center the modal vertically
        destroyOnClose: true, // Destroy the modal when it is closed
      }}
      onFinish={async (values) => {
        console.log(values);
        await updateAvatarForUser({ image: values.avatar[0]?.originFileObj })
          .then(() => {
            message.success('Update avatar successfully');
            return true;
          })
          .catch(() => {
            message.error('Update avatar failed');
            return false;
          });
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%', // Ensure full height of the modal content
        }}
      >
        <ProFormUploadButton
          listType="picture-circle"
          title={<UserOutlined size={60} />}
          name="avatar"
          icon={null}
          buttonProps={{
            shape: 'circle',
            size: 'large',
            style: { width: 100, height: 100, fontSize: 50 },
          }}
          max={1}
          fieldProps={{
            children: <div>Upload avatar</div>,
            accept: 'image/*',
            showUploadList: { showPreviewIcon: true, showRemoveIcon: true },
            multiple: false,
            maxCount: 1,
          }}
        />
      </div>
    </ModalForm>
  );
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  const { styles } = useStyles();
  const { initialState, setInitialState, refresh } = useModel('@@initialState');
  const [visible, setVisible] = React.useState(false);

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined, loading: false }));
        });
        loginOut();
        history.push(`/login`);

        return;
      } else if (key === 'updateAvatar') {
        setVisible(true);
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState?.currentUser?.username) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'updateAvatar',
      icon: <UserOutlined />,
      label: 'Update Avatar',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <ModalUpdateAvatar visible={visible} />
    </>
  );
};
