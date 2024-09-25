import AddProvider from '@/components/provider/AddProvider';
import { getProviders, ProviderItem, removeProvider } from '@/services/provider';
import { DeleteOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';

const ProviderList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const intl = useIntl();

  const columns: ProColumns<ProviderItem>[] = [
    {
      title: <FormattedMessage id="pages.provider.code" defaultMessage="Code" />,
      dataIndex: 'code',
      tooltip: 'The provider code is unique',
      formItemProps: {
        rules: [
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.provider.code.required"
                defaultMessage="Provider code is required"
              />
            ),
          },
        ],
      },
    },
    {
      title: <FormattedMessage id="pages.provider.name" defaultMessage="Name" />,
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.provider.tax" defaultMessage="Tax" />,
      dataIndex: 'tax',
      valueType: 'text',
      search: false,
    },
    {
      title: <FormattedMessage id="pages.provider.address" defaultMessage="Address" />,
      dataIndex: 'address',
      search: false,
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.provider.phone" defaultMessage="Phone" />,
      dataIndex: 'phone',
      search: false,
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.provider.response" defaultMessage="Response" />,
      dataIndex: 'response',
      search: false,
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.provider.major" defaultMessage="Major" />,
      dataIndex: 'major',
      valueType: 'select',

      valueEnum: {
        Construction: { text: 'Construction' },
        Production: { text: 'Production' },
        Printing: { text: 'Printing' },
        Led: { text: 'Led' },
        Billboard: { text: 'Billboard' },
        Pano: { text: 'Pano' },
        Banner: { text: 'Banner' },
        Bandroll: { text: 'Bandroll' },
        POSM: { text: 'POSM' },
        StreetFurniture: { text: 'Street Furniture' },
        Trivision: { text: 'Trivision' },
        BusShelter: { text: 'Bus Shelter' },
        TrainShelter: { text: 'Train Shelter' },
        AirportTerminal: { text: 'Airport Terminal' },
        LightBox: { text: 'Light Box' },
        LCDFrame: { text: 'LCD/ Frame' },
        Subway: { text: 'Subway' },
        Bus: { text: 'Bus' },
        Taxi: { text: 'Taxi' },
        Plane: { text: 'Plane' },
        Train: { text: 'Train' },
        Coach: { text: 'Coach' },
        TruckLorry: { text: 'Truck/Lorry' },
        Car: { text: 'Car' },
        Roadshow: { text: 'Roadshow' },
        Activation: { text: 'Activation' },
        Event: { text: 'Event' },
      },
    },
    {
      title: <FormattedMessage id="pages.provider.priority" defaultMessage="Priority" />,
      dataIndex: 'priority',
      valueType: 'digit',
      search: false,
    },
    {
      title: <FormattedMessage id="pages.provider.status" defaultMessage="Status" />,
      dataIndex: 'status',
      search: false,
      //valueType: 'select',
      //   valueEnum: {
      //     0: {
      //       text: <FormattedMessage id="pages.provider.status.inactive" defaultMessage="Inactive" />,
      //       status: 'Default',
      //     },
      //     1: {
      //       text: <FormattedMessage id="pages.provider.status.active" defaultMessage="Active" />,
      //       status: 'Processing',
      //     },
      //     3: {
      //       text: <FormattedMessage id="pages.provider.status.deleted" defaultMessage="Deleted" />,
      //       status: 'Error',
      //     },
      //   },
    },
    {
      title: <FormattedMessage id="pages.provider.createdAt" defaultMessage="Created At" />,
      dataIndex: 'createdAt',
      search: false,
      render: (text: any) => dayjs(text).format('DD/MM/YYYY'),
    },

    {
      title: <FormattedMessage id="pages.provider.option" defaultMessage="Action" />,
      dataIndex: 'option',
      valueType: 'option',
      search: false,
      render: (_, record: any) => [
        <AddProvider
          type="update"
          initialValues={record}
          onLoad={() => actionRef.current?.reload()}
        />,
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={async () => {
            await removeProvider(record._id);
            actionRef.current?.reloadAndRest?.();
          }}
        />,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ProviderItem>
        headerTitle={intl.formatMessage({
          id: 'pages.provider.title',
          defaultMessage: 'Provider Management',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
          layout: 'vertical',
        }}
        toolBarRender={() => [
          <AddProvider type="create" onLoad={() => actionRef.current?.reload()} />,
        ]}
        request={getProviders}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            console.log(selectedRows);
          },
        }}
      />
    </PageContainer>
  );
};

export default ProviderList;
