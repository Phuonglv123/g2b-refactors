import { IUser } from '@/types/user';
import { getSrcImg } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space, Typography } from 'antd';

type DisplayUserProps = {
  user: IUser;
};

const DisplayUser = ({ user }: DisplayUserProps) => {
  return (
    <Space style={{ width: 100 }}>
      <Avatar src={getSrcImg(user?.avatar)} icon={<UserOutlined />} size={25} />
      <Typography.Text strong>{user?.username}</Typography.Text>
    </Space>
  );
};

export default DisplayUser;
