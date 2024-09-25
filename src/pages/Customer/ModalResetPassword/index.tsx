import { resetPasswordByAdmin } from '@/services/user';
import { RestOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Input, message, Modal } from 'antd';
import React, { useState } from 'react';

interface ModalResetPasswordProps {
  userId: string;
}

const ModalResetPassword: React.FC<ModalResetPasswordProps> = ({ userId }) => {
  const [newPassword, setNewPassword] = useState<string>('');

  const handleFinish = async (values: { password: string }) => {
    try {
      const response = await resetPasswordByAdmin(userId, { password: values.password });
      if (response.errrorCode === 0) {
        setNewPassword(values.password);
        showSuccessModal();
        return true; // Close the modal
      } else {
        message.error('Đặt lại mật khẩu thất bại');
        return false; // Keep the modal open
      }
    } catch (error) {
      console.error('Reset password failed:', error);
      message.error('Đặt lại mật khẩu thất bại');
      return false; // Keep the modal open
    }
  };

  const showSuccessModal = () => {
    Modal.success({
      title: 'Mật khẩu đã được đặt lại thành công',
      content: (
        <div>
          <p>Mật khẩu mới:</p>
          <Input.Password
            value={newPassword}
            readOnly
            addonAfter={
              <a
                onClick={() => {
                  navigator.clipboard.writeText(newPassword);
                  message.success('Đã sao chép mật khẩu');
                }}
              >
                Sao chép
              </a>
            }
          />
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <ModalForm
      title="Đặt lại mật khẩu"
      trigger={<Button type="primary" size="small" danger icon={<RestOutlined />} />}
      onFinish={handleFinish}
      modalProps={{
        destroyOnClose: true,
      }}
    >
      <ProForm.Group>
        <ProFormText.Password
          name="password"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
          ]}
        />
        <ProFormText.Password
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
              },
            }),
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default ModalResetPassword;
