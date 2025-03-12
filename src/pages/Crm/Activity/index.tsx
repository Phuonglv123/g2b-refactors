import TypeActivities from '@/components/crm/TypeActivities';
import { deleteActivity, getActivities } from '@/services/activities';
import { DeleteOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Space, Tooltip } from 'antd';
import { useRef } from 'react';

const ActivitiesTab = () => {
  const actionRef = useRef<ActionType>();
  const onRequest = async () => {
    try {
      const { errorCode, data, total } = await getActivities({});
      if (errorCode === 0) {
        return {
          data: data,
          total,
        };
      } else {
        return {
          data: [],
        };
      }
    } catch (error) {
      return {
        data: [],
      };
    }
  };

  const onDelete = async (id: string) => {
    try {
      const { errorCode } = await deleteActivity(id);
      if (errorCode === 0) {
        message.success('Activity deleted successfully');
        actionRef.current?.reload();
      }
    } catch (error) {
      message.error('Failed to delete activity');
    }
  };

  return (
    <ProTable
      actionRef={actionRef}
      request={onRequest}
      search={false}
      toolBarRender={false}
      columns={[
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          render: (text: any) => {
            return <TypeActivities status={text} />;
          },
        },
        {
          title: 'Date',
          dataIndex: 'dueDate',
          key: 'date',
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: 'Duration',
          dataIndex: 'callDuration',
          key: 'duration',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          render: (_, record: any) => {
            return (
              <Space>
                {/* <Button>Edit</Button> */}
                <Tooltip title="Delete">
                  <Button
                    onClick={() => {
                      Modal.confirm({
                        title: 'Are you sure you want to delete this activity?',
                        onOk: () => onDelete(record?._id),
                      });
                    }}
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              </Space>
            );
          },
        },
      ]}
    />
  );
};

export default ActivitiesTab;
