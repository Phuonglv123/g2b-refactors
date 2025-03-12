import { createOrder } from '@/services/orders';
import { EditableProTable, ProColumns } from '@ant-design/pro-components';
import { Empty, message } from 'antd';
import { useState } from 'react';

type DataSourceType = {
  name: string;
  quantity: number;
  price: number;
  note: string;
  id: React.Key;
};

type OrderTabProps = {
  order: any;
  id?: string;
  refresh?: () => void;
};
const OrderTab = ({ order, id }: OrderTabProps) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(order?.orderItems);
  console.log(dataSource);
  if (order?.orderItems?.length < 0) {
    return <Empty />;
  }
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'name',
      dataIndex: 'name',
      tooltip: 'Product name',
      formItemProps: {
        rules: [
          { required: true, message: 'Product name is required' },
        ],
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      tooltip: 'Product quantity',
      valueType: 'digit',
      width: 150,
      fieldProps: {
        min: 1, // Set minimum value
      },
      formItemProps: {
        rules: [
          { required: true, message: 'Product quantity is required' },
          { type: 'number', min: 1, message: 'Quantity must be at least 1' }
        ],
      },
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
      width: 150,
      valueType: 'money',
      fieldProps: {
        min: 1000, // Set minimum value
      },
      formItemProps: {
        rules: [
          { required: true, message: 'Product price is required' },
          { type: 'number', min: 1000, message: 'Price must be at least 1000' }
        ],
      },
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },

    {
      title: 'Action',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          Edit
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  const onFormSubmit = async (rowKey: any, data: any, row: any) => {
    console.log('onFormSubmit', rowKey, data, row);
    if (!order) {
      const { errorCode } = await createOrder({
        opportunityId: id,
        orderItems: [
          {
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            note: data.note,
          },
        ],
      });
      if (errorCode === 0) {
        console.log('Order created successfully');
        message.success('Order created successfully');
      }
    }
  };

  return (
    <div>
      <EditableProTable<DataSourceType>
        rowKey="id"
        maxLength={5}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={{
          position: 'bottom',
          record: () => ({
            id: Math.random() * 1000000,
            name: '',
            quantity: 0,
            price: 0,
            note: '',
          }),
        }}
        loading={false}
        columns={columns}
        dataSource={order?.orderItems}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: onFormSubmit,
          onChange: setEditableRowKeys,
        }}
      />
    </div>
  );
};

export default OrderTab;
