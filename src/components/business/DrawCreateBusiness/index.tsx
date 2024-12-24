import { createBusiness, updatedBusiness } from '@/services/business';
import { IBusiness } from '@/types/business';
import { EditOutlined } from '@ant-design/icons';
import { DrawerForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import dayjs from 'dayjs';
type DrawCreateBusinessProps = {
  type: 'create' | 'update';
  data?: IBusiness;
  onLoad?: any;
};

const DrawCreateBusiness = ({ type, data, onLoad }: DrawCreateBusinessProps) => {
  const [form] = ProForm.useForm();

  const onFinish = async (values: IBusiness) => {
    try {
      const payload: any = { ...values, code: values.code || dayjs().unix() };
      await createBusiness(payload);
      message.success('Create business successfully');
      onLoad();
      form.resetFields();
      return true;
    } catch (error: any) {
      const errorCode = error.data.errorCode;
      const messages = error.data.message;
      message.error(`Error code: ${errorCode}, ${messages}`);
      return false;
    }
  };

  const onUpdate = async (values: IBusiness) => {
    if (!data?._id) return;
    try {
      await updatedBusiness(data?._id, values);
      message.success('Update business successfully');
      onLoad();
      return true;
    } catch (error: any) {
      const errorCode = error.data.errorCode;
      const messages = error.data.message;
      message.error(`Error code: ${errorCode}, ${messages}`);
      return false;
    }
  };
  return (
    <DrawerForm<IBusiness>
      title="Create Company"
      trigger={
        type === 'create' ? (
          <Button type="primary">Create</Button>
        ) : (
          <Button size="small" icon={<EditOutlined />} />
        )
      }
      onFinish={type === 'create' ? onFinish : onUpdate}
      initialValues={data}
      form={form}
    >
      <ProFormText name={'code'} label={'Code'} />
      <ProFormText
        name={'name'}
        label={'Name Company'}
        rules={[
          {
            required: true,
            message: 'Please enter the company name',
          },
        ]}
      />
      <ProFormSelect
        label={'Industry'}
        name={'industry'}
        options={[
          {
            value: 'FMCG',
            label: 'FMCG',
          },
          {
            value: 'E-commerce',
            label: 'E-commerce',
          },
          {
            value: 'F&B',
            label: 'F&B',
          },
          {
            value: 'Finance',
            label: 'Finance',
          },
          {
            value: 'Banking',
            label: 'Banking',
          },
          {
            value: 'Electronics',
            label: 'Electronics',
          },
          {
            value: 'Refrigeration',
            label: 'Refrigeration',
          },
          {
            value: 'Beauty & Health',
            label: 'Beauty & Health',
          },
          {
            value: 'Insurance',
            label: 'Insurance',
          },
          {
            value: 'Jewelry',
            label: 'Jewelry',
          },
          {
            value: 'Real Estate',
            label: 'Real Estate',
          },
          {
            value: 'Pharmaceuticals',
            label: 'Pharmaceuticals',
          },
          {
            value: 'Cosmetics',
            label: 'Cosmetics',
          },
          {
            value: 'Credit',
            label: 'Credit',
          },
          {
            value: 'Technique',
            label: 'Technique',
          },
          {
            value: 'Tourism',
            label: 'Tourism',
          },
          {
            value: 'Entertainment',
            label: 'Entertainment',
          },
          {
            value: 'Education',
            label: 'Education',
          },
          {
            value: 'Game',
            label: 'Game',
          },
          {
            value: 'Air',
            label: 'Air',
          },
          {
            value: 'Cinema',
            label: 'Cinema',
          },
          {
            value: 'Event',
            label: 'Event',
          },
          {
            value: 'Manufacture',
            label: 'Manufacture',
          },
          {
            value: 'Beverage',
            label: 'Beverage',
          },
          {
            value: 'Agency',
            label: 'Agency',
          },
        ]}
      />
      <ProFormText label="Response" name={'response'} />
      <ProFormText label="Hotline" name={'hotline'} />
      <ProFormText label="Email" name={'email'} />
      <ProFormText label="Website" name={'website'} />
      <ProFormSelect
        label="Group"
        name={'group'}
        options={[
          {
            value: 'Potential customer',
            label: 'Potential customer',
          },
          {
            value: 'Current customer',
            label: 'Current customer',
          },
          {
            value: 'Former customer',
            label: 'Former customer',
          },
          {
            value: 'Others',
            label: 'Others',
          },
        ]}
      />
      <ProFormSelect
        label="Source"
        name={'source'}
        options={[
          {
            value: 'Social media',
            label: 'Social media',
          },
          {
            value: 'Email Marketing',
            label: 'Email Marketing',
          },
          {
            value: 'Organic search',
            label: 'Organic search',
          },
          {
            value: 'Advertising',
            label: 'Advertising',
          },
          {
            value: 'Introduction',
            label: 'Introduction',
          },
          {
            value: 'Hotline',
            label: 'Hotline',
          },
          {
            value: 'Offline source',
            label: 'Offline source',
          },
          {
            value: 'Cold call',
            label: 'Cold call',
          },
          {
            value: 'Customer Company',
            label: 'Customer Company',
          },
        ]}
      />
      <ProFormText label="Note" name={'note'} />
      <ProFormSelect
        label="Status"
        name={'status'}
        options={[
          {
            value: 0,
            label: 'Inactive',
          },
          {
            value: 1,
            label: 'Active',
          },
        ]}
      />
    </DrawerForm>
  );
};

export default DrawCreateBusiness;
