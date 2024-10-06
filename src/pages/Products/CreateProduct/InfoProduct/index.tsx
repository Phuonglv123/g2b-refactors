import { getProviders } from '@/services/provider';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

const InfoProduct = () => {
  const onRequestProvier = async () => {
    try {
      const res = await getProviders();
      return res?.data?.map((provider: any) => ({
        label: provider.name,
        value: provider?._id,
      }));
    } catch (error) {
      return [];
    }
  };
  return (
    <ProForm.Group
      title="Product Infomation"
      size={'large'}
      style={{ width: '100%' }}
      spaceProps={{ style: { width: '100%' } }}
      rowProps={{ gutter: 0, justify: 'space-between' }}
    >
      <ProFormText name="product_code" label="Product code" width="md" />
      <ProFormText
        name="product_name"
        label="Product name"
        width="md"
        rules={[
          {
            required: true,
            message: 'Please input product name!',
          },
          {
            max: 48,
            message: 'Product name must be less than 48 characters!',
          },
        ]}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: 'Please input product type!',
          },
        ]}
        options={[
          { value: 'LED', label: 'LED' },
          { value: 'BILLBOARD', label: 'BILLBOARD' },
          { value: 'PANO', label: 'Pano' },
          { value: 'BANNER', label: 'Banner' },
          { value: 'BANDROLL', label: 'Bandroll' },
          { value: 'POSM', label: 'POSM' },
          { value: 'TRIVISION', label: 'TRIVISION' },
          { value: 'LIGHT_BOX', label: 'LIGHT BOX' },
          { value: 'LCD_FRAME', label: 'LCD/FRAME' },
          { value: 'ROADSHOW', label: 'ROADSHOW' },
          { value: 'ACTIVATION', label: 'ACTIVATION' },
          { value: 'TRANSIT_AD', label: 'TRANSIT AD' },
          { value: 'AIRPORT', label: 'AIRPORT' },
          { value: 'METRO_SUBWAY', label: 'METRO/SUBWAY' },
          { value: 'TRAIN_STATION', label: 'TRAIN_STATION' },
          { value: 'STREET_FURNITURE', label: 'STREET FURNITURE' },
          { value: 'CINEMA', label: 'CINEMA' },
          { value: 'OTHERS', label: 'OTHERS' },
        ]}
        name="type"
        label="Product type"
        width="md"
      />
      <ProFormSelect
        name="currency"
        label="Currency"
        rules={[
          {
            required: true,
            message: 'Please input currency!',
          },
        ]}
        width="md"
        options={[
          {
            value: 'VND',
            label: 'VND',
          },
          {
            value: 'USD',
            label: 'USD',
          },
          {
            value: 'EUR',
            label: 'EUR',
          },
          {
            value: 'JPY',
            label: 'JPY',
          },
          {
            value: 'CNY',
            label: 'CNY',
          },
          {
            value: 'HKD',
            label: 'KRW',
          },
          {
            value: 'GBP',
            label: 'GBP',
          },

          {
            value: 'CAD',
            label: 'CAD',
          },
          {
            value: 'SGD',
            label: 'SGD',
          },
          {
            value: 'THB',
            label: 'THB',
          },
          {
            value: 'MYR',
            label: 'MYR',
          },
          {
            value: 'INR',
            label: 'IDR',
          },
          {
            value: 'PHP',
            label: 'PHP',
          },
        ]}
      />
      <ProFormDependency name={['currency']}>
        {({ currency }) => (
          <ProFormDigit
            name="cost"
            label="Cost"
            width="md"
            rules={[
              {
                required: true,
                message: 'Please input cost!',
              },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: 'Please input valid cost!',
              },
            ]}
            fieldProps={{
              suffix: currency,
              precision: 0,
              formatter: (value) =>
                value ? new Intl.NumberFormat('vi-VN').format(Number(value)) : '0',
              parser: (value: any) => value?.toString().replace(/\./g, '') || '0',
            }}
            min={0}
          />
        )}
      </ProFormDependency>
      <ProFormSelect
        options={[
          {
            label: '1 Day',
            value: '1 Day',
          },
          {
            label: '1 Week',
            value: '1 Week',
          },
          {
            label: '1 Month',
            value: '1 Month',
          },
          {
            label: '1 Year',
            value: '1 Year',
          },
        ]}
        name="booking_duration"
        label="Booking duration"
        width="md"
        rules={[
          {
            required: true,
            message: 'Please input booking duration!',
          },
        ]}
      />

      <ProFormSelect
        showSearch
        name="areas"
        label="Areas"
        mode="multiple"
        options={[
          { value: 'indoor', label: 'Indoor' },
          { value: 'outdoor', label: 'Outdoor' },
          { value: 'intersection', label: 'Intersection' },
          { value: 'roundabout', label: 'Roundabout' },
          { value: 'industrial_area', label: 'Industrial Area' },
          { value: 'shopping_mall', label: 'Shopping Mall' },
          { value: 'school', label: 'School' },
          { value: 'airport', label: 'Airport' },
          { value: 'highway', label: 'Highway' },
          { value: 'route', label: 'Route' },
          { value: 'city_center', label: 'City Center' },
          { value: 'hospital', label: 'Hospital' },
          { value: 'metro_subways', label: 'Metro/Subways' },
          { value: 'park', label: 'Park' },
          { value: 'supermarket', label: 'Supermarket' },
          { value: 'metro_train_bus_station', label: 'Metro/Train/Bus Station' },
          { value: 'office_building', label: 'Office Building' },
          { value: 'residents', label: 'Residents' },
          { value: 'others', label: 'Others' },
        ]}
        width="md"
        rules={[
          {
            required: true,
            message: 'Please input areas!',
          },
        ]}
      />
      <ProFormText name="production_cost" label="Production cost" width="md" />
      <ProFormSelect
        request={onRequestProvier}
        name="provider"
        label="Vendor"
        width="md"
        rules={[
          {
            required: true,
            message: 'Please input provider!',
          },
        ]}
      />
      <ProFormDigit
        name="traffic"
        label="Traffic"
        rules={[
          {
            required: true,
            message: 'Please input traffic!',
          },
        ]}
        fieldProps={{
          suffix: 'Vehicle/day',
          formatter: (value) =>
            value ? new Intl.NumberFormat('vi-VN').format(Number(value)) : '0',
          parser: (value: any) => value?.toString().replace(/\./g, '') || '0',
        }}
        width={'md'}
        min={0}
      />
      <ProFormSelect
        name="status"
        label="Status"
        options={[
          {
            value: 1,
            label: 'Active',
          },
          {
            value: 0,
            label: 'Deactive',
          },
        ]}
        rules={[
          {
            required: true,
            message: 'Please input status!',
          },
        ]}
        width="md"
      />
      <ProFormTextArea
        name="description"
        label="Description"
        width={1024}
        rules={[
          {
            max: 386,
            message: 'Description must be less than 386 characters!',
          },
        ]}
      />
    </ProForm.Group>
  );
};

export default InfoProduct;
