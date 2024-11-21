import DrawCreateBusiness from '@/components/business/DrawCreateBusiness';
import { deleteBusiness, getBusiness, updatedBusiness } from '@/services/business';
import { formatDate } from '@/utils';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Switch, message } from 'antd';
import { useRef } from 'react';

const Business: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
      search: false,
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      search: false,
    },
    {
      title: 'Response',
      dataIndex: 'response',
      key: 'response',
      search: false,
    },
    {
      title: 'Created At',
      key: 'createdAt',
      search: false,
      render: (_: any, record: any) => formatDate(record.createdAt),
    },
    {
      title: 'Created By',
      key: 'createdAt',
      search: false,
      render: (_: any, record: any) => record.createBy?.username,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      search: false,
      render: (_: any, record: any) => (
        <Switch
          checked={record.status === 1}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={(checked) => updateStatusBusiness(record?._id, checked ? 1 : 0)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      search: false,
      valueType: 'option',
      render: (_: any, record: any) => [
        <Button
          size="small"
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            Modal.confirm({
              title: 'Delete Business',
              content: 'Are you sure to delete this customer?',
              onOk: () =>
                deleteBusinessId(record?._id).then((res) =>
                  message.success('Delete customer successfully'),
                ),
            });
          }}
        />,
        <DrawCreateBusiness
          type="update"
          data={record}
          onLoad={() => actionRef.current?.reload()}
        />,
      ],
    },
  ];

  const updateStatusBusiness = async (id: string, status: number) => {
    try {
      await updatedBusiness(id, { status });
      message.success('Update business successfully');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      const errorCode = error.data.errorCode;
      const messages = error.data.message;
      message.error(`Error code: ${errorCode}, ${messages}`);
      return false;
    }
  };

  const deleteBusinessId = async (id: string) => {
    try {
      await deleteBusiness(id);
      message.success('Delete business successfully');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      const errorCode = error.data.errorCode;
      const messages = error.data.message;
      message.error(`Error code: ${errorCode}, ${messages}`);
      return false;
    }
  };

  const onRequest = async (params: any) => {
    const response: any = await getBusiness(params);
    return {
      data: response.data,
      success: response.errorCode === 0,
      total: response.data.length,
    };
  };
  return (
    <PageContainer title="Manage Customer">
      <ProTable
        actionRef={actionRef}
        search={{
          layout: 'vertical',
        }}
        request={onRequest}
        columns={columns}
        toolBarRender={() => [
          <DrawCreateBusiness type="create" onLoad={() => actionRef.current?.reload()} />,
        ]}
      />
    </PageContainer>
  );
};

export default Business;
