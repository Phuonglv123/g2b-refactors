import { countNotificationsIsRead, getNotifications, readNotification } from '@/services/noti';
import { getSrcImg } from '@/utils';
import { BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Link, useRequest } from '@umijs/max';
import { Avatar, Badge, Button, List, Popover } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

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
  const [open, setOpen] = React.useState(false);
  // const [initLoading, setInitLoading] = React.useState(true);
  // const [loading, setLoading] = React.useState(false);
  // const [noti, setNoti] = React.useState<any[]>([]);
  // const [list, setList] = React.useState<any[]>([]);
  const [page] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const { data } = useRequest(() => countNotificationsIsRead(), {
    pollingInterval: 2000, // Polling every 2 seconds
  });

  const listNotifications = useRequest(() => getNotifications({ page: page, size: size }), {
    pollingInterval: 2000, // Polling
  });

  // const items: MenuProps['items'] = listNotifications.data
  //   ? listNotifications.data.map((item: any) => ({
  //       key: item._id, // Use `value` as the unique key
  //       label: (
  //         <Link
  //           to={`/tasks/detail/${item.task}`}
  //           onClick={() => {
  //             readNotification(item._id);
  //           }}
  //         >
  //           <Divider dashed />
  //           <div>
  //             {item?.is_read ? item.title : <Badge status="warning" text={item.title} />}{' '}
  //             <Flex>
  //               {item.from && (
  //                 <Space>
  //                   <div style={{ fontWeight: 'bold' }}>From {item.from?.username}</div>
  //                   <Avatar size={24} src={getSrcImg(item.from?.avatar)} icon={<UserOutlined />} />
  //                 </Space>
  //               )}
  //             </Flex>
  //           </div>
  //           <div style={{ fontSize: 12 }}>
  //             Date: {dayjs(item.createdAt).format('MMMM D, YYYY h:mm A')}
  //           </div>
  //         </Link>
  //       ),
  //     }))
  //   : [];
  // console.log(items);

  const loadMore = !listNotifications.loading ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      <Button
        type="link"
        onClick={() => {
          setSize(size + 10);
          listNotifications.refresh();
        }}
        //disabled={listNotifications.data.total <= page * size}
      >
        Loading more
      </Button>
    </div>
  ) : null;
  return (
    <Popover
      content={
        <List
          style={{ width: 500, height: 600, overflow: 'auto' }}
          className="demo-loadmore-list"
          loading={listNotifications.loading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={listNotifications?.data}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={getSrcImg(item.from?.avatar)} />}
                title={
                  <Link
                    to={`/tasks/detail/${item.task}`}
                    onClick={() => {
                      readNotification(item._id);
                    }}
                  >
                    {item?.is_read ? (
                      item.title + ' from ' + item?.from?.username
                    ) : (
                      <Badge status="warning" text={item.title + ' from ' + item?.from?.username} />
                    )}
                  </Link>
                }
                description={`Date: ${dayjs(item.createdAt).format('MMMM D, YYYY h:mm A')}`}
              />
            </List.Item>
          )}
        />
      }
      title="Notification"
      trigger="click"
      open={open}
      onOpenChange={() => setOpen(!open)}
    >
      <Badge count={data} size="small" offset={[0, 10]}>
        <Button icon={<BellOutlined style={{ fontSize: 24 }} />} type="text" />
      </Badge>{' '}
    </Popover>
    // <Dropdown menu={{ items }} trigger={['click']}>
    //   <a onClick={(e) => e.preventDefault()}>

    //   </a>
    // </Dropdown>
  );
};
