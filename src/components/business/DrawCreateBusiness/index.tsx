import { createBusiness, updatedBusiness } from '@/services/business';
import { IBusiness } from '@/types/business';
import { EditOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
type DrawCreateBusinessProps = {
  type: 'create' | 'update';
  data?: IBusiness;
  onLoad?: any;
};

const DrawCreateBusiness = ({ type, data, onLoad }: DrawCreateBusinessProps) => {
  const onFinish = async (values: IBusiness) => {
    try {
      await createBusiness(values);
      message.success('Create business successfully');
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
          <Button icon={<EditOutlined />} />
        )
      }
      onFinish={type === 'create' ? onFinish : onUpdate}
      initialValues={data}
    >
      <ProFormText name={'name'} label={'Name Company'} />
      <ProFormSelect
        label={'Industry'}
        name={'industry'}
        options={[
          {
            value: 'FMCG',
            label: 'FMCG',
          },
          {
            value: 'TMĐT',
            label: 'TMĐT',
          },
          {
            value: 'F&B',
            label: 'F&B',
          },
          {
            value: 'Tài chính - Ngân hàng',
            label: 'Tài chính - Ngân hàng',
          },
          {
            value: 'Điện tử',
            label: 'Điện tử',
          },
          {
            value: 'Điện lạnh',
            label: 'Điện lạnh',
          },
          {
            value: 'Làm đẹp/Chăm sóc sức khỏe',
            label: 'Làm đẹp/Chăm sóc sức khỏe',
          },
          {
            value: 'Bảo hiểm',
            label: 'Bảo hiểm',
          },
          {
            value: 'Trang sức',
            label: 'Trang sức',
          },
          {
            value: 'Bất động sản',
            label: 'Bất động sản',
          },
          {
            value: 'Dược phẩm',
            label: 'Dược phẩm',
          },
          {
            value: 'Mỹ phẩm',
            label: 'Mỹ phẩm',
          },
          {
            value: 'Tín dụng',
            label: 'Tín dụng',
          },
          {
            value: 'Kỹ thuật',
            label: 'Kỹ thuật',
          },
          {
            value: 'Du lịch',
            label: 'Du lịch',
          },
          {
            value: 'Giải trí',
            label: 'Giải trí',
          },
          {
            value: 'Giáo dục',
            label: 'Giáo dục',
          },
          {
            value: 'Game',
            label: 'Game',
          },
          {
            value: 'Hàng không',
            label: 'Hàng không',
          },
          {
            value: 'Điện ảnh',
            label: 'Điện ảnh',
          },
          {
            value: 'Event',
            label: 'Event',
          },
          {
            value: 'Sản xuất',
            label: 'Sản xuất',
          },
        ]}
      />
      <ProFormText label="Response" name={'response'} />
      <ProFormText label="Hotline" name={'hotline'} />
      <ProFormText label="Email" name={'email'} />
      <ProFormText label="Website" name={'website'} />

      <ProFormText label="Group" name={'group'} />
      <ProFormText label="Source" name={'source'} />
      <ProFormText label="Estimated budget" name={'estimated_budget'} />
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
