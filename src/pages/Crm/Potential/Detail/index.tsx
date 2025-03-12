import Activities from '@/components/crm/Activities';
import CustomerTab from '@/components/crm/Customer';
import ModalCreateActivities from '@/components/crm/ModalCreateActivities';
import OrderTab from '@/components/crm/Order';
import OverviewOpportunity from '@/components/crm/OverviewOpportunity';
import TaskTab from '@/components/crm/Task';
import ModalCreateTask from '@/components/task/ModalCreateTask';
import DisplayUser from '@/components/user/DisplayUser';
import { getOpportunity, updateOpportunity } from '@/services/opportunity';
import { formatDate } from '@/utils';
import {
  ApartmentOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  MailOutlined,
  PhoneOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useParams, useRequest } from '@umijs/max';
import { Avatar, Flex, message, Space, Steps, Typography } from 'antd';
import { useState } from 'react';
import { history } from 'umi';

const DetailPotentail = () => {
  const { id } = useParams<{ id: string }>();
  const [key, setKey] = useState('overview');

  const { data, refresh } = useRequest(
    () => {
      if (!id) {
        return;
      }
      return getOpportunity(id);
    },
    {
      refreshDeps: [id],
    },
  );

  const renderIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Avatar style={{ backgroundColor: '#87d068' }} icon={<PhoneOutlined />} size={34} />;
      case 'note':
        return <Avatar style={{ backgroundColor: '#108ee9' }} icon={<MailOutlined />} size={34} />;
      case 'task':
        return <Avatar style={{ backgroundColor: '#f50' }} icon={<CarryOutOutlined />} size={34} />;
      case 'calaendar':
        return <Avatar style={{ backgroundColor: '#f50' }} icon={<CalendarOutlined />} size={34} />;
      default:
        return <Avatar style={{ backgroundColor: '#f50' }} icon={<CarryOutOutlined />} size={34} />;
    }
  };

  const renderCurrentStep = (state: string) => {
    switch (state) {
      case 'open':
        return 0;
      case 'interested':
        return 1;
      case 'introduce':
        return 2;
      case 'negotiate':
        return 3;
      case 'won':
        return 4;
      case 'lost':
        return 5;
      default:
        return 0;
    }
  };

  const onChangeStep = async (state: string) => {
    if (!id) {
      return;
    }
    const { errorCode } = await updateOpportunity(id, { state });
    if (errorCode === 0) {
      message.success('Opportunity updated successfully');

      refresh();
    }
  };

  return (
    <PageContainer onBack={() => history.push('/crm/opportunity')} title="Detail Opportunity">
      <ProCard split="vertical" gutter={16}>
        <ProCard colSpan="80%" split="horizontal">
          <ProCard>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Flex gap={14} justify="space-between">
                <Typography.Title level={5}>Opportunity Information</Typography.Title>
              </Flex>
              <Typography.Text>Title: {data?.title}</Typography.Text>
              <Typography.Text>Description: {data?.description}</Typography.Text>
              <Typography.Text>Status: {data?.status}</Typography.Text>
              <Space>
                CreatedBy: <DisplayUser user={data?.createdBy} />{' '}
              </Space>
            </Space>
            <br />
            <br />
            <Steps
              current={renderCurrentStep(data?.state)}
              onChange={(current) => {
                switch (current) {
                  case 0:
                    onChangeStep('open');
                    break;
                  case 1:
                    onChangeStep('interested');
                    break;
                  case 2:
                    onChangeStep('introduce');
                    break;
                  case 3:
                    onChangeStep('negotiate');
                    break;
                  case 4:
                    onChangeStep('won');
                    break;
                  case 5:
                    onChangeStep('lost');
                    break;
                  default:
                    break;
                }
              }}
              size="small"
              type="navigation"
              items={[
                {
                  title: 'Open',
                },
                {
                  title: 'Interested',
                },
                {
                  title: 'Introduce',
                },
                {
                  title: 'Negotiate',
                },
                {
                  title: 'Won',
                },
                {
                  title: 'Lost',
                },
              ]}
            />
          </ProCard>

          <ProCard
            tabs={{
              activeKey: key,
              tabBarExtraContent:
                key === 'tasks' ? (
                  <ModalCreateTask onLoad={() => refresh()} opportunityId={id} />
                ) : null,
              onChange: (key) => {
                setKey(key);
              },
              items: [
                {
                  key: 'overview',
                  label: 'Overview',
                  icon: <AppstoreOutlined />,
                  children: <OverviewOpportunity data={data} id={id} refresh={() => refresh()} />,
                },
                {
                  key: 'activities',
                  label: 'Activities',
                  icon: <ApartmentOutlined />,
                  children: <Activities data={data?.activities} />,
                },
                {
                  key: 'order',
                  label: 'Order',
                  icon: <ShoppingCartOutlined />,
                  children: <OrderTab order={data?.orders} id={id} />,
                },
                {
                  key: 'customer',
                  label: 'Customer',
                  icon: <UserOutlined />,
                  children: <CustomerTab cutomers={data?.customers} id={id} />,
                },
                {
                  key: 'tasks',
                  label: 'Tasks',
                  icon: <ProfileOutlined />,
                  children: <TaskTab tasks={data?.project} id={id} />,
                },
              ],
            }}
          />
        </ProCard>
        <ProCard
          title={
            <Space>
              <ModalCreateActivities type="phone" key="phone" id={id} refresh={() => refresh()} />
              <ModalCreateActivities type="note" key="note" id={id} refresh={() => refresh()} />
              <ModalCreateActivities type="task" key="task" id={id} refresh={() => refresh()} />
              <ModalCreateActivities
                type="calendar"
                key="calendar"
                id={id}
                refresh={() => refresh()}
              />
            </Space>
          }
          headerBordered
        >
          <Typography.Title level={5}>History</Typography.Title>
          <Flex gap={14} vertical>
            {data?.activities?.map((activity: any) => (
              <Space key={activity._id}>
                <div>{renderIcon(activity.type)}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 'bold' }}>{activity.title}</div>
                  <div>
                    {activity.description} - {formatDate(activity.dueDate)}
                  </div>
                </div>
              </Space>
            ))}
          </Flex>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default DetailPotentail;
