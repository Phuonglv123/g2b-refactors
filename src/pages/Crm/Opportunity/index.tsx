import { deleteOpportunity, getOpportunities } from '@/services/opportunity';
import { IOpportunity } from '@/types/opportunity';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import { useRef } from 'react';
import { history } from '@umijs/max';

const Opportunity = () => {
  const actionRef = useRef<ActionType>();

  const onDelete = async (id: string) => {
    try {
      const { errorCode } = await deleteOpportunity(id);
      if (errorCode === 0) {
        message.success('Opportunity deleted successfully');
        actionRef.current?.reload();
      }
    } catch (error) {
      message.error('Failed to delete opportunity');
    }
  }

  const columns: ProColumns<IOpportunity>[] = [
    {
      title: 'Title',
      dataIndex: ['respone', 'title'],
      key: 'title',
      width: 100,
      render: (text, record) => {
        return record.respone.title.toUpperCase();
      },
    },
    {
      title: 'Full name',
      dataIndex: ['respone', 'name'],
      key: 'description',
    },
    {
      title: 'Department',
      dataIndex: ['respone', 'department'],
      key: 'respone.department',
    },
    {
      title: 'Phone',
      dataIndex: ['respone', 'phone'],
      key: 'respone.phone',
    },
    {
      title: 'Email',
      dataIndex: ['respone', 'email'],
      key: 'respone.email',
    },
    {
      title: 'Address',
      dataIndex: ['respone', 'address'],
      key: 'respone.address',
    },
    {
      title: 'Company',
      dataIndex: 'name',
      key: 'company.type',
    },
    {
      title: 'Bank Account',
      dataIndex: ['company', 'bankAccount'],
      key: 'company.bankAccount',
    },
    {
      title: 'Bank Name',
      dataIndex: ['company', 'bankName'],
      key: 'company.bankName',
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record: any) => (
        <Space>
          <Button type="primary" onClick={()=>history.push(`/crm/opportunity/${record?._id}`)} >Detail</Button>
          <Button type="primary" danger onClick={()=>onDelete(record?._id)}>Delete</Button>
        </Space>
      )
    }
  ];

  const onRequest = async (
    params: any,
    sort: Record<string, any>,
    filter: Record<string, (string | number)[] | null>,
  ) => {
    try {
      const { errorCode, data } = await getOpportunities({ ...params, sort, filter });
      if (errorCode === 0) {
        return {
          data: data,
          success: true,
          total: data.total,
        };
      }
      return {
        data: [],
        success: false,
        total: 0,
      };
    } catch (error) {
      console.log(error);
      message.error('Failed to fetch opportunities');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };
  return (
    <ProTable
    toolBarRender={false}
      search={false}
      request={onRequest}
      scroll={{ x: 1300 }}
      columns={columns}
      actionRef={actionRef}
      tableLayout="fixed"
    />
  );
};

export default Opportunity;
