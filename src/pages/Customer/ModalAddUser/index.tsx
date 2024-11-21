import { registerUser, updateAvatar, updateRoleUser } from '@/services/user';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import { useState } from 'react';

type ModalAddUserProps = {
  onLoad: any;
  type: 'add' | 'edit';
  initValue?: any;
};

const ModalAddUser = ({ onLoad, type, initValue }: ModalAddUserProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await registerUser(values);
      console.log(res);
      if (res.errrorCode === 0) {
        onLoad();
        Modal.info({
          title: 'Thông báo',
          content: (
            <div>
              <div>Tạo mới người dùng thành công</div>
              <div>Tên đăng nhập: {values.username}</div>
              <div>Mật Khẩu: {values.password}</div>
            </div>
          ),
        });
        return true;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: any) => {
    console.log(values);
    setLoading(true);
    try {
      const payload = {
        role: values.role,
      };
      if (values.avatar?.length > 0) {
        await updateAvatar(initValue._id, { image: values.avatar[0].originFileObj });
      }
      const res = await updateRoleUser(initValue._id, payload);
      console.log(res);
      if (res.errorCode === 0) {
        onLoad();
        Modal.info({
          title: 'Thông báo',
          content: <div>Cập nhật người dùng thành công</div>,
        });
        return true;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalForm
      title={type === 'add' ? 'Add new user' : 'Update user'}
      width={400}
      onFinish={type === 'edit' ? handleUpdate : handleFinish}
      loading={loading}
      initialValues={initValue}
      trigger={
        type === 'add' ? (
          <Button key="3" type="primary">
            Tạo mới
          </Button>
        ) : (
          <Button type="primary" size="small" icon={<EditOutlined />} />
        )
      }
      modalProps={{
        destroyOnClose: true,
      }}
    >
      <ProFormUploadButton
        label="Avatar"
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
        }}
      />
      <ProFormText name="email" label="Email" disabled={type === 'edit'} />
      <ProFormText name="username" label="Tên đăng nhập" disabled={type === 'edit'} />
      <ProFormText.Password name="password" label="Mật khẩu" hidden={type === 'edit'} />
      <ProFormSelect
        name="role"
        label="Quyền"
        mode="multiple"
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Editor', value: 'editor' },
          { label: 'Sale', value: 'sale' },
          { label: 'Client', value: 'client' },
        ]}
      />
      <ProFormSelect
        hidden={type === 'edit'}
        name="status"
        label="Trạng thái"
        options={[
          { label: 'Không hoạt động', value: 0 },
          { label: 'Hoạt động', value: 1 },
        ]}
      />
    </ModalForm>
  );
};

export default ModalAddUser;
