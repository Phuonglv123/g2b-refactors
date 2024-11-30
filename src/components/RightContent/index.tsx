import { countNotificationsIsRead, getNotifications, readNotification } from '@/services/noti';
import { BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Link, useRequest } from '@umijs/max';
import { Badge, Button, Dropdown, MenuProps } from 'antd';

export type SiderTheme = 'light' | 'dark';

// export const SelectLang = () => {
//   return (
//     <UmiSelectLang
//       style={{
//         padding: 4,
//       }}
//     />
//   );
// };

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

export const NoticeIconView = () => {
  const { data } = useRequest(() => countNotificationsIsRead(), {
    pollingInterval: 2000, // Polling every 2 seconds
  });

  const listNotifications = useRequest(() => getNotifications(), {
    pollingInterval: 2000, // Polling
  });

  const items: MenuProps['items'] = listNotifications.data
    ? listNotifications.data.map((item: any) => ({
        key: item._id, // Use `value` as the unique key
        label: (
          <Link
            to={`/tasks/${item.task}`}
            onClick={() => {
              readNotification(item._id);
            }}
          >
            {item?.is_read ? item.title : <Badge status="warning" text={item.title} />}
          </Link>
        ),
      }))
    : [];
  console.log(items);
  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <a onClick={(e) => e.preventDefault()}>
        <Badge count={data} size="small" offset={[0, 10]}>
          <Button icon={<BellOutlined style={{ fontSize: 24 }} />} type="text" />
        </Badge>
      </a>
    </Dropdown>
  );
};
