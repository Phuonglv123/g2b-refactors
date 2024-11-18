import { getProduct, updateOrderImagesProduct } from '@/services/products';
import { IProduct } from '@/types/product';
import { formatNumberVietnamese, getSrcImg } from '@/utils';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Empty, Image, Space, Tag } from 'antd';
import { arrayMoveImmutable } from 'array-move';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ value }: any) => {
  return <Image src={getSrcImg(value)} />;
});

const SortableList = SortableContainer(({ items }: any) => {
  return (
    <Space>
      {items.map((value: any, index: any) => (
        //@ts-ignore
        <SortableItem axis="xy" key={`item-${value}`} index={index} value={value} />
      ))}
    </Space>
  );
});

const DetailProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<any>({
    user_id: '',
    product_code: '',
    product_name: '',
    type: '',
    areas: [],
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
      country: {},
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

  const [items, setItems] = useState([]);
  console.log('items', items);

  const onSortEnd = async ({ oldIndex, newIndex }: any) => {
    setItems(arrayMoveImmutable(items, oldIndex, newIndex));
    const itemsMove = arrayMoveImmutable(items, oldIndex, newIndex);
    await updateOrderImagesProduct(id, { images: itemsMove }).then((res) => {
      onRequest();
    });
  };

  const onRequest = useCallback(async () => {
    const data = await getProduct(id);
    setData(data.data);
    setItems(data.data.images);
  }, [id]);

  useEffect(() => {
    onRequest();
  }, []);
  return (
    <PageContainer>
      <ProDescriptions<IProduct>
        layout="vertical"
        bordered
        dataSource={data}
        title="Product Information"
      >
        <ProDescriptions.Item label="Product code" dataIndex="product_code" span={1} />
        <ProDescriptions.Item label="Product name" dataIndex="product_name" span={1} />
        <ProDescriptions.Item label="Product type" dataIndex="type" span={1} />
        <ProDescriptions.Item label="AREAS" span={1}>
          {data?.areas?.map((area: any) => (
            <Tag color="success">{area.charAt(0).toUpperCase() + area.slice(1)}</Tag>
          ))}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="Cost" dataIndex="cost" span={1} />
        <ProDescriptions.Item label="Production cost" dataIndex="production_cost" span={1} />
        <ProDescriptions.Item
          label="Provider"
          // dataIndex="provider"
          render={(_, record: any) => record?.provider?.name}
          span={1}
        />
        <ProDescriptions.Item label="Booking duration" dataIndex="booking_duration" span={1} />
        <ProDescriptions.Item label="Currency" dataIndex="currency" span={1} />
        <ProDescriptions.Item label="Tracffic" span={1}>
          {formatNumberVietnamese(data.traffic)} vehicles/day
        </ProDescriptions.Item>

        <ProDescriptions.Item
          label="Created At"
          dataIndex="createdAt"
          span={1}
          render={(_, record) => dayjs(record?.createdAt).format('DD/MM/YYYY')}
        />
        <ProDescriptions.Item
          label="Status"
          span={1}
          dataIndex="status"
          render={(_, record) => {
            return record.status === 0 ? (
              <Tag color="dange">Inactive</Tag>
            ) : (
              <Tag color="success">Active</Tag>
            );
          }}
        />
        {items.length > 0 && (
          <ProDescriptions.Item
            span={3}
            label="Images"
            dataIndex="images"
            render={(_, record) => {
              //@ts-ignore
              return <SortableList axis={'xy'} items={items} onSortEnd={onSortEnd} />;
            }}
          />
        )}
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
        <ProDescriptions.Item
          label="Country"
          render={(_, record) => record?.location?.country?.name}
        />
        <ProDescriptions.Item label="City" dataIndex={['location', 'city']} />
        <ProDescriptions.Item label="Ward" dataIndex={['location', 'ward']} />
        <ProDescriptions.Item label="District" dataIndex={['location', 'district']} />
        <ProDescriptions.Item label="Address" dataIndex={['location', 'address']} />
        <ProDescriptions.Item label="Longitude" dataIndex={['location', 'longitude']} />
        <ProDescriptions.Item label="Latitude" dataIndex={['location', 'latitude']} />
        <ProDescriptions.Item
          label="Status"
          dataIndex={['location', 'status']}
          render={(_, record) => {
            return record.location.status === 0 ? (
              <Tag color="dange">Inactive</Tag>
            ) : (
              <Tag color="success">Active</Tag>
            );
          }}
        />
        <ProDescriptions.Item label="Street" dataIndex={['location', 'street']} />
        <ProDescriptions.Item label="GPS" dataIndex={['location', 'gps']} />
      </ProDescriptions>
    </PageContainer>
  );
};

export default DetailProduct;
