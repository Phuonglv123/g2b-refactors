import { updateOpportunity } from '@/services/opportunity';
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Empty, Form, message } from 'antd';
import { useState } from 'react';

type OverviewOpportunityProps = {
  data: any;
  id?: string;
  refresh?: () => void;
};

const OverviewOpportunity = ({ data, id, refresh }: OverviewOpportunityProps) => {
  console.log(data);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values: any) => {
    try {
      if (!id) {
        return;
      }
      setLoading(true);
      const { errorCode } = await updateOpportunity(id, values);
      if (errorCode === 0) {
        console.log('success');
        if (refresh) refresh();
        message.success('Updated successfully');
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('submit');
      form.submit();
    }
  };

  if (!data) return <Empty />;
  return (
    <div onKeyDown={handleKeyPress}>
      <ProForm
        loading={loading}
        form={form}
        initialValues={data}
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: 'Save',
          },
          resetButtonProps: {
            hidden: true,
          },
        }}
      >
        <ProForm.Group title="Opportunity Information ">
          <ProFormSelect
            width={'xl'}
            name={['respone', 'title']}
            label="Title"
            options={[
              {
                label: 'MR',
                value: 'mr',
              },
              {
                label: 'MRS',
                value: 'mrs',
              },
              {
                label: 'MS',
                value: 'ms',
              },
            ]}
          />
          <ProFormText width={'xl'} name={['respone', 'name']} label="Full name" />
          <ProFormText width={'xl'} name={['respone', 'email']} label="Email" />
          <ProFormText width={'xl'} name={['respone', 'phone']} label="Phone" />
          <ProFormText width={'xl'} name={['respone', 'address']} label="Address" />
          <ProFormText width={'xl'} name={['respone', 'department']} label="Department" />
        </ProForm.Group>
        <ProForm.Group title="Company">
          <ProFormText width={'xl'} name={['company', 'bankAccount']} label="Bank Account" />
          <ProFormText width={'xl'} name={['company', 'bankName']} label="Bank Name" />
          <ProFormText width={'xl'} name={['company', 'type']} label="Type" />
          <ProFormText width={'xl'} name={['company', 'field']} label="Field" />
          <ProFormText width={'xl'} name={['company', 'scale']} label="Scale" />
          <ProFormText width={'xl'} name={['company', 'major']} label="Major" />
          <ProFormText width={'xl'} name={['company', 'taxCode']} label="Tax Code" />
        </ProForm.Group>
      </ProForm>
    </div>
  );
};

export default OverviewOpportunity;
