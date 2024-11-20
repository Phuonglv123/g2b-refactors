import { listUser, toggleUserStatus } from '@/services/user';
import { getSrcImg } from '@/utils';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Avatar, Space, Switch, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import ModalAddUser from './ModalAddUser';
import ModalResetPassword from './ModalResetPassword';

const Customer: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const onRequestUser = async (params: any) => {
    setLoading(true);
    const res = await listUser({
      page: params.current,
      size: params.pageSize,
    });
    console.log(res);
    setLoading(false);
    return {
      data: res.data,
      total: res.pagination.total,
    };
  };

  const toggle = async (id: string) => {
    try {
      setLoading(true);
      const data = await toggleUserStatus(id);
      if (data.errorCode === 0) {
        message.success('Cập nhật trạng thái thành công');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      actionRef.current?.reload();
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Avatar',
      key: 'avatar',
      render: (text: any, record: any) => <Avatar size={'large'} src={getSrcImg(record.avatar)} />,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      key: 'role',
      search: false,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      search: false,
      render: (text: any, record: any) => {
        return dayjs(text).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      search: false,
      render: (_: any, record: any) => {
        return (
          <Switch
            onChange={() => toggle(record._id)}
            value={record.status}
            checked={record.status === 1}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      search: false,
      render: (text: any, record: any) => {
        return (
          <Space>
            <Tooltip title="Chỉnh sửa">
              <ModalAddUser
                type="edit"
                initValue={record}
                onLoad={() => actionRef.current?.reload()}
              />
            </Tooltip>
            <Tooltip title="Khôi phục mật khẩu">
              <ModalResetPassword userId={record._id} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <ProTable
        search={{
          layout: 'vertical',
        }}
        actionRef={actionRef}
        loading={loading}
        columns={columns}
        request={onRequestUser}
        toolBarRender={() => [
          <ModalAddUser type="add" key="1" onLoad={() => actionRef.current?.reload()} />,
        ]}
      />
    </div>
  );
};

export default Customer;
