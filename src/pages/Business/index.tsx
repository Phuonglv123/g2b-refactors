import DrawCreateBusiness from '@/components/business/DrawCreateBusiness';
import { deleteBusiness, getBusiness, updatedBusiness } from '@/services/business';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Switch, message } from 'antd';
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
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
    },
    {
      title: 'Response',
      dataIndex: 'response',
      key: 'response',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
      valueType: 'option',
      render: (_: any, record: any) => [
        <Button
          icon={<DeleteOutlined />}
          onClick={() => {
            deleteBusinessId(record._id);
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
    <PageContainer title="Manage Business">
      <ProTable
        actionRef={actionRef}
        request={onRequest}
        columns={columns}
        toolBarRender={() => [<DrawCreateBusiness type="create" />]}
      />
    </PageContainer>
  );
};

export default Business;
