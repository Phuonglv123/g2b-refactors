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
      message.success('Delete location success');
      actionRef.current?.reload();
    } catch (error) {
      message.error('Delete location failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ProCard title="List Locations">
      <ProTable
        actionRef={actionRef}
        columns={[
          {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            render: (country: any) => country.name,
          },
          {
            title: 'City/Province',
            dataIndex: 'city',
            key: 'city',
            search: false,
          },
          {
            title: 'District',
            dataIndex: 'district',
            key: 'district',
            search: false,
          },
          {
            title: 'Ward',
            dataIndex: 'ward',
            key: 'ward',
            search: false,
          },
          {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            search: false,
          },
          {
            title: 'Longitude',
            dataIndex: 'longitude',
            key: 'longitude',
            search: false,
          },
          {
            title: 'Latitude',
            dataIndex: 'latitude',
            key: 'latitude',
            search: false,
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            search: false,

            render: (status: any) => (
              <Tag color={status ? 'green' : 'red'}>{status ? 'Hoạt động' : 'Không hoạt động'}</Tag>
            ),
          },
          {
            title: 'Action',
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
