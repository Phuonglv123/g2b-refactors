import ModalCreateBusiness from '@/components/Business/ModalCreateBusiness';
import { listProducts } from '@/services/products';
import {
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Space } from 'antd';

const CreateBilling = () => {
  const listBusiness = async () => {};
  const listProduct = async () => {
    const data = await listProducts({ page: 1, limit: 300 });
    return data?.data?.map((item: any) => {
      return { label: item.product_name, value: item._id };
    });
  };
  return (
    <ProCard title="Create New Bill" headerBordered style={{ width: 800, margin: '0 auto' }}>
      <ProForm>
        <ProFormSelect
          label={
            <Space>
              <div>Company Name</div>
              <div>
                <ModalCreateBusiness />
              </div>
            </Space>
          }
          name={'business_id'}
          showSearch
          rules={[{ required: true, message: 'Please select a company' }]}
        />
        <ProFormSelect
          request={listProduct}
          label="Product Name"
          name={'product_id'}
          rules={[
            {
              required: true,
              message: 'Please select a product',
            },
          ]}
        />
        <ProFormGroup>
          <ProFormSelect
            width={360}
            label="Billing Type"
            name={'billing_type'}
            options={[
              {
                value: 'Flat Rate',
                label: 'Flat Rate',
              },
              {
                value: 'CPM',
                label: 'CPM',
              },
              {
                value: 'CPA',
                label: 'CPA',
              },
            ]}
          />
          <ProFormSelect label="Currency" name={'currency'} width={360} />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormDatePicker width={360} label="Start Date" name={'start_date'} />
          <ProFormDatePicker width={360} label="End Date" name={'end_date'} />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormDatePicker width={360} label="Duration in Days" name={'duration_in_days'} />
          <ProFormDigit width={360} label="Impressions" name={'impressions'} />
        </ProFormGroup>

        <ProFormDigit label="Traffic Estimate" name={'traffic_estimate'} />
        <ProFormTextArea label="Description" name={'description'} />
      </ProForm>
    </ProCard>
  );
};

export default CreateBilling;
