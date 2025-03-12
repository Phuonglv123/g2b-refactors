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
import { Avatar, Button, Flex, message, Space, Typography } from 'antd';
import { useState } from 'react';
import { history } from 'umi';

const DetailOpportunity = () => {
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

  const onChangePotentail = async () => {
    if (!id) {
      return;
    }
    const { errorCode, data } = await updateOpportunity(id, { type: 'potential' });
    if (errorCode === 0) {
      message.success('Opportunity updated successfully');

      refresh();
      history.push(`/crm/potential/${data._id}`);
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

                <Button type="primary" onClick={() => onChangePotentail()}>
                  Change Potential
                </Button>
              </Flex>
              <Typography.Text>Title: {data?.title}</Typography.Text>
              <Typography.Text>Description: {data?.description}</Typography.Text>
              <Typography.Text>Status: {data?.status}</Typography.Text>
              <Typography.Text>
                CreatedBy: <DisplayUser user={data?.createdBy} />{' '}
              </Typography.Text>
            </Space>
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

export default DetailOpportunity;
