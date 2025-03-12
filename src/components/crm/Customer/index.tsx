import DrawCreateBusiness from '@/components/business/DrawCreateBusiness';
import { ProTable } from '@ant-design/pro-components';

type CustomerTabProps = {
  cutomers: any[];
  id?: string;
  refresh?: () => void;
};
const CustomerTab = ({ cutomers, id, refresh }: CustomerTabProps) => {
  // if (!cutomers?.length) {
  //   return <Empty />;
  // }

  return (
    <ProTable
      search={false}
      dataSource={cutomers}
      columns={[
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          key: 'phone',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
      ]}
      toolBarRender={() => [
        <DrawCreateBusiness type="create" onLoad={refresh} key="create" opportunityId={id} />,
      ]}
    />
  );
};

export default CustomerTab;
