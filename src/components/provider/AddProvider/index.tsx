import { addProvider, updateProvider } from '@/services/provider';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';
import { FormattedMessage } from 'umi';

type AddProviderProps = {
  onLoad?: () => void;
  type: 'create' | 'update';
  initialValues?: any;
};

const AddProvider: React.FC<AddProviderProps> = ({ onLoad, type, initialValues }) => {
  const handleAdd = async (values: any) => {
    try {
      const payload = {
        ...values,
      };
      await addProvider(payload);
      message.success('Provider added successfully');
      if (onLoad) onLoad();
      return true;
    } catch (error) {
      message.error('Failed to add provider');
      return false;
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      await updateProvider(values._id, values);
      message.success('Provider updated successfully');
      if (onLoad) onLoad();
      return true;
    } catch (error) {
      message.error('Failed to update provider');
      return false;
    }
  };

  return (
    <DrawerForm
      title={
        <FormattedMessage
          id="pages.provider.createForm.newProvider"
          defaultMessage={type === 'create' ? 'New Vendor' : 'Update Vendor'}
        />
      }
      trigger={
        type === 'create' ? (
          <Button type="primary" key="primary">
            <PlusOutlined /> <FormattedMessage id="pages.provider.new" defaultMessage="New" />
          </Button>
        ) : (
          <Button type="primary" key="primary" icon={<EditOutlined />} />
        )
      }
      onFinish={type === 'create' ? handleAdd : handleUpdate}
      initialValues={initialValues}
    >
      <ProFormText name="_id" hidden />
      <ProFormText
        name="code"
        label={<FormattedMessage id="pages.provider.code" defaultMessage="Code" />}
      />
      <ProFormText
        name="name"
        label={<FormattedMessage id="pages.provider.name" defaultMessage="Name" />}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.provider.name.required"
                defaultMessage="Provider name is required"
              />
            ),
          },
        ]}
      />
      <ProFormText
        name="tax"
        label={<FormattedMessage id="pages.provider.tax" defaultMessage="Tax" />}
      />
      <ProFormText
        name="address"
        label={<FormattedMessage id="pages.provider.address" defaultMessage="Address" />}
      />
      <ProFormText
        name="phone"
        label={<FormattedMessage id="pages.provider.phone" defaultMessage="Phone" />}
      />
      <ProFormText
        name="response"
        label={<FormattedMessage id="pages.provider.response" defaultMessage="Response" />}
      />
      <ProFormSelect
        name="major"
        label={<FormattedMessage id="pages.provider.major" defaultMessage="Major" />}
        mode="multiple"
        options={[
          { label: 'Street banners', value: 'Street banners' },
          { label: 'Static Billboard ', value: 'Static Billboard ' },
          { label: 'Digital Billboard ', value: 'Digital Billboard ' },

          { label: 'Installation company ', value: 'Installation company ' },
          { label: 'Production', value: 'Production' },
          { label: 'Printing', value: 'Printing' },
          { label: 'POSM', value: 'POSM' },
          { label: 'Event', value: 'Event' },
          { label: 'Activation', value: 'Activation' },
          { label: 'Roadshow', value: 'Roadshow' },
          { label: 'Digital Media ', value: 'Digital Media ' },
          { label: 'Social Media ', value: 'Social Media ' },
          { label: 'PR Agency ', value: 'PR Agency ' },
          { label: 'TV Advertising ', value: 'TV Advertising ' },
          { label: 'Radio Advertising ', value: 'Radio Advertising ' },
          { label: 'Creative agency ', value: 'Creative agency ' },
          { label: 'Press ad ', value: 'Press ad ' },
          { label: 'Industrial zone advertising', value: 'Industrial zone advertising' },
          { label: 'Transit Ad ', value: 'Transit Ad ' },
          { label: 'Taxi Ad', value: 'Taxi Ad' },
          { label: 'Bus Ad', value: 'Bus Ad' },
          { label: 'Train /Bus Station', value: 'Train /Bus Station' },
          { label: 'Subway/Metro Advertising ', value: 'Subway/Metro Advertising ' },
          { label: 'LCD/ Frame in Building ', value: 'LCD/ Frame in Building ' },
          { label: 'Street Furniture', value: 'Street Furniture' },
          { label: 'Airport Advertising', value: 'Airport Advertising' },
          { label: 'Shopping Mall Ad ', value: 'Shopping Mall Ad ' },
          { label: 'OOH ', value: 'OOH' },
        ]}
      />
      <ProFormSelect
        name="priority"
        label="priority"
        options={[
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
        ]}
      />
    </DrawerForm>
  );
};

export default AddProvider;
