import { registerUser } from '@/services/user';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import { useState } from 'react';

const ModalAddUser = ({ onLoad }: any) => {
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

  return (
    <ModalForm
      title="Add User"
      width={400}
      onFinish={handleFinish}
      loading={loading}
      trigger={
        <Button key="3" type="primary">
          Tạo mới
        </Button>
      }
      modalProps={{
        destroyOnClose: true,
      }}
    >
      <ProFormText name="email" label="Email" />
      <ProFormText name="username" label="Tên đăng nhập" />
      <ProFormText.Password name="password" label="Mật khẩu" />
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
