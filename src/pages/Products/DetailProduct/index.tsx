import { getProduct } from '@/services/products';
import { IProduct } from '@/types/product';
import { getSrcImg } from '@/utils';
import { ProDescriptions } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Empty, Image, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const DetailProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>({
    user_id: '',
    product_code: '',
    product_name: '',
    type: '',
    areas: '',
    status: 0,
    images: [],
    cost: 0,
    production_cost: '',
    provider: {},
    traffic: '',
    booking_duration: '',
    currency: '',
    attributes: {
      width: 0,
      height: 0,
      video_duration: 0,
      pixel_width: 0,
      pixel_height: 0,
      opera_time_from: '',
      opera_time_to: '',
      frequency: '',
      shape: '',
      note: '',
      add_side: 0,
    },
    location: {
      international: false,
      country: '',
      city: '',
      user_id: '',
      ward: '',
      district: '',
      address: '',
      longitude: 0,
      latitude: 0,
      status: 0,
      street: '',
      gps: '',
    },
  });
  if (!id) {
    return <Empty />;
  }
  const onRequest = useCallback(async () => {
    const data = await getProduct(id);
    setData(data.data);
  }, [id]);

  useEffect(() => {
    onRequest();
  }, []);
  return (
    <div>
      <ProDescriptions<IProduct>
        layout="vertical"
        bordered
        dataSource={data}
        title="Product Information"
      >
        <ProDescriptions.Item label="Product code" dataIndex="product_code" />
        <ProDescriptions.Item label="Product name" dataIndex="product_name" />
        <ProDescriptions.Item label="Product type" dataIndex="type" />
        <ProDescriptions.Item label="Area" dataIndex="areas" />
        <ProDescriptions.Item label="Cost" dataIndex="cost" />
        <ProDescriptions.Item label="Production cost" dataIndex="production_cost" />
        <ProDescriptions.Item
          label="Provider"
          // dataIndex="provider"
          render={(_, record: any) => record?.provider?.name}
        />
        <ProDescriptions.Item label="Booking duration" dataIndex="booking_duration" />
        <ProDescriptions.Item label="Currency" dataIndex="currency" />
        <ProDescriptions.Item label="Tracffic" dataIndex="trafic" />
        <ProDescriptions.Item label="Created At" dataIndex="createdAt" />
        <ProDescriptions.Item label="Status" dataIndex="status" />
        <ProDescriptions.Item
          label="Images"
          dataIndex="images"
          render={(_, record) => {
            return (
              <Space>
                {record.images.map((item: any) => (
                  <Image src={getSrcImg(item)} width={200} />
                ))}
              </Space>
            );
          }}
        />
      </ProDescriptions>
      <br />
      <ProDescriptions layout="vertical" bordered dataSource={data} title="Thuộc tính sản phẩm">
        <ProDescriptions.Item label="Width" dataIndex={['attributes', 'width']} />
        <ProDescriptions.Item label="Height" dataIndex={['attributes', 'height']} />
        <ProDescriptions.Item label="Video duration" dataIndex={['attributes', 'video_duration']} />
        <ProDescriptions.Item label="Pixel width" dataIndex={['attributes', 'pixel_width']} />
        <ProDescriptions.Item label="Pixel height" dataIndex={['attributes', 'pixel_height']} />
        <ProDescriptions.Item
          label="Opera time from"
          dataIndex={['attributes', 'opera_time_from']}
        />
        <ProDescriptions.Item label="Opera time to" dataIndex={['attributes', 'opera_time_to']} />
        <ProDescriptions.Item label="Frequency" dataIndex={['attributes', 'frequency']} />
        <ProDescriptions.Item label="Shape" dataIndex={['attributes', 'shape']} />
        <ProDescriptions.Item label="Note" dataIndex={['attributes', 'note']} />
        <ProDescriptions.Item label="Add side" dataIndex={['attributes', 'add_side']} />
      </ProDescriptions>
      <br />
      <ProDescriptions layout="vertical" bordered dataSource={data} title="Thông tin vị trí">
        <ProDescriptions.Item label="International" dataIndex={['location', 'international']} />
        <ProDescriptions.Item label="Country" dataIndex={['location', 'country']} />
        <ProDescriptions.Item label="City" dataIndex={['location', 'city']} />
        <ProDescriptions.Item label="Ward" dataIndex={['location', 'ward']} />
        <ProDescriptions.Item label="District" dataIndex={['location', 'district']} />
        <ProDescriptions.Item label="Address" dataIndex={['location', 'address']} />
        <ProDescriptions.Item label="Longitude" dataIndex={['location', 'longitude']} />
        <ProDescriptions.Item label="Latitude" dataIndex={['location', 'latitude']} />
        <ProDescriptions.Item label="Status" dataIndex={['location', 'status']} />
        <ProDescriptions.Item label="Street" dataIndex={['location', 'street']} />
        <ProDescriptions.Item label="GPS" dataIndex={['location', 'gps']} />
      </ProDescriptions>
    </div>
  );
};

export default DetailProduct;
