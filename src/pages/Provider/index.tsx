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
        'Street banners': { text: 'Street banners' },
        'Static Billboard ': { text: 'Static Billboard ' },
        'Digital Billboard ': { text: 'Digital Billboard ' },
        'Installation company ': { text: 'Installation company ' },
        Production: { text: 'Production' },
        Printing: { text: 'Printing' },
        POSM: { text: 'POSM' },
        Event: { text: 'Event' },
        Activation: { text: 'Activation' },
        Roadshow: { text: 'Roadshow' },
        'Digital Media ': { text: 'Digital Media ' },
        'Social Media ': { text: 'Social Media ' },
        'PR Agency ': { text: 'PR Agency ' },
        'TV Advertising ': { text: 'TV Advertising ' },
        'Radio Advertising ': { text: 'Radio Advertising ' },
        'Creative agency ': { text: 'Creative agency ' },
        'Press ad ': { text: 'Press ad ' },
        'Industrial zone advertising': { text: 'Industrial zone advertising' },
        'Transit Ad ': { text: 'Transit Ad ' },
        'Taxi Ad': { text: 'Taxi Ad' },
        'Bus Ad': { text: 'Bus Ad' },
        'Train /Bus Station': { text: 'Train /Bus Station' },
        'Subway/Metro Advertising ': { text: 'Subway/Metro Advertising ' },
        'LCD/ Frame in Building ': { text: 'LCD/ Frame in Building ' },
        'Street Furniture': { text: 'Street Furniture' },
        'Airport Advertising': { text: 'Airport Advertising' },
        'Shopping Mall Ad ': { text: 'Shopping Mall Ad ' },
        'OOH ': { text: 'OOH' },
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

  const listProvider = async (params: any) => {
    const response = await getProviders(params);
    return {
      data: response.data,
      success: true,
      total: response.pagination.total,
    };
  };

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
        request={listProvider}
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
