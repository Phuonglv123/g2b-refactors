import { ProTable } from '@ant-design/pro-components';
import { Empty } from 'antd';
import TypeActivities from '../TypeActivities';

type ActivitiesProps = {
  data: any;
  id?: string;
  refresh?: () => void;
};
const Activities = ({ data, id, refresh }: ActivitiesProps) => {
  console.log(data, id, refresh);
  if (!data.length) {
    return <Empty />;
  }

  return (
    <ProTable
      dataSource={data}
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
          }
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
        },
      ]}
    />
  );
};

export default Activities;
