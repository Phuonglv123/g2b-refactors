import ModalCreateActivities from '@/components/crm/ModalCreateActivities';
import {
  ClusterOutlined,
  CustomerServiceOutlined,
  DesktopOutlined,
  OpenAIOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Space } from 'antd';
import { useState } from 'react';
import ActivitiesTab from './Activity';
import Opportunity from './Opportunity';
import Potential from './Potential';
import DesktopTab from './Desktop';

const CrmPage: React.FC = () => {
  const [tab, setTab] = useState(window.location.pathname.split('/')[2]);

  const handleChange = (key: string) => {
    setTab(key);
    history.push(`/crm/${key}`);
  };

  const renderAction = (key: string) => {
    switch (key) {
      case 'desktop':
        return <Button>Cr</Button>;
      case 'opportunity':
        return (
          <Button type="primary" onClick={() => history.push('/crm/opportunity/create')}>
            Create New Opportunity
          </Button>
        );
      case 'potential':
        return (
          <Button type="primary" onClick={() => history.push('/crm/opportunity/create')}>
            Create New Potential
          </Button>
        );
      case 'activity':
        return (
          <Space>
            <ModalCreateActivities type={'phone'} refresh={() => window.location.reload()} />
            <ModalCreateActivities type={'calendar'} refresh={() => window.location.reload()} />
            <ModalCreateActivities type={'note'} refresh={() => window.location.reload()} />
            <ModalCreateActivities type={'task'} refresh={() => window.location.reload()} />
          </Space>
        );
      default:
        return <div>dsadsa</div>;
    }
  };
  return (
    <PageContainer
      onTabChange={handleChange}
      tabActiveKey={tab}
      tabList={[
        {
          tab: 'Desktop',
          icon: <DesktopOutlined />,
          key: 'desktop',
          children: <DesktopTab/>,
        },
        {
          tab: 'Opportunity',
          icon: <OpenAIOutlined />,
          key: 'opportunity',
          children: <Opportunity />,
        },
        {
          tab: 'Potential',
          icon: <CustomerServiceOutlined />,
          key: 'potential',
          children: <Potential />,
        },
        {
          tab: 'Activity',
          icon: <ClusterOutlined />,
          key: 'activity',
          children: <ActivitiesTab />,
        },
      ]}
      title="CRM"
      tabBarExtraContent={renderAction(tab)}
    ></PageContainer>
  );
};

export default CrmPage;
