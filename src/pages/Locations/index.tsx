import { deleteLocation, getLocations } from '@/services/location';
import { DeleteOutlined } from '@ant-design/icons';
import { ActionType, ProCard, ProTable } from '@ant-design/pro-components';
import { Button, Tag, message } from 'antd';
import { useRef, useState } from 'react';
import CreateLocation from './CreateLocation';

const Locations: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const listLoccations = async (params: any) => {
    setLoading(true);
    const pageSize = params.pageSize || 10;
    const current = params.current || 1;

    const response = await getLocations({
      page: current,
      size: pageSize,
      keyword: params.country,
      international: true,
    });
    if (response?.errorCode === 0) {
      return {
        data: response.data.data,
        total: response.data.pagination.total,
      };
    }
    setLoading(false);
    return [];
  };

  const deleteLocationById = async (id: string) => {
    setLoading(true);
    try {
      await deleteLocation(id);
      message.success('Xóa địa điểm thành công');
      actionRef.current?.reload();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ProCard title="Danh sách địa điểm">
      <ProTable
        actionRef={actionRef}
        columns={[
          {
            title: 'Tên địa điểm',
            dataIndex: 'country',
            key: 'country',
          },
          {
            title: 'Thành phố/Tỉnh',
            dataIndex: 'city',
            key: 'city',
            search: false,
          },
          {
            title: 'Quận/Huyện',
            dataIndex: 'district',
            key: 'district',
            search: false,
          },
          {
            title: 'Phường/Xã',
            dataIndex: 'ward',
            key: 'ward',
            search: false,
          },
          {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            search: false,
          },
          {
            title: 'Kinh độ',
            dataIndex: 'longitude',
            key: 'longitude',
            search: false,
          },
          {
            title: 'Vĩ độ',
            dataIndex: 'latitude',
            key: 'latitude',
            search: false,
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            search: false,

            render: (status: any) => (
              <Tag color={status ? 'green' : 'red'}>{status ? 'Hoạt động' : 'Không hoạt động'}</Tag>
            ),
          },
          {
            title: 'Thao tác',
            valueType: 'option',
            render: (_, record) => [
              <CreateLocation
                type="update"
                initValues={record}
                locationId={record._id}
                onLoad={() => actionRef.current?.reload()}
                key="update"
              />,
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteLocationById(record._id)}
                key="delete"
              />,
            ],
          },
        ]}
        search={{
          layout: 'vertical',
        }}
        request={listLoccations}
        toolBarRender={() => [
          <CreateLocation type="create" onLoad={() => actionRef.current?.reload()} />,
        ]}
      />
    </ProCard>
  );
};

export default Locations;
