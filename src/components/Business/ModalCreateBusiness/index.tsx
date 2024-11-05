import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button } from 'antd';

const ModalCreateBusiness = () => {
  return (
    <ModalForm
      title="Create New Business"
      trigger={
        <Button type="primary" size="small">
          New Business
        </Button>
      }
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        console.log(values);
        return true;
      }}
    >
      <ProFormText
        width="md"
        name="company_name"
        label="Company Name"
        placeholder="Enter company name"
        rules={[{ required: true, message: 'Please enter company name' }]}
      />
      <ProFormText
        width="md"
        name="contact_person"
        label="Contact Person"
        placeholder="Enter contact person"
        rules={[{ required: true, message: 'Please enter contact person' }]}
      />
      <ProFormText
        width="md"
        name="email"
        label="Email"
        placeholder="Enter email"
        rules={[{ required: true, message: 'Please enter email' }]}
      />
      <ProFormText
        width="md"
        name="phone_number"
        label="Phone Number"
        placeholder="Enter phone number"
        rules={[{ required: true, message: 'Please enter phone number' }]}
      />
      <ProFormText
        width="md"
        name="address"
        label="Address"
        placeholder="Enter address"
        rules={[{ required: true, message: 'Please enter address' }]}
      />
      <ProFormText
        width="md"
        name="country"
        label="Country"
        placeholder="Enter country"
        rules={[{ required: true, message: 'Please enter country' }]}
      />
      <ProFormText
        width="md"
        name="city"
        label="City"
        placeholder="Enter city"
        rules={[{ required: true, message: 'Please enter city' }]}
      />
      <ProFormText
        width="md"
        name="zip_code"
        label="Zip Code"
        placeholder="Enter zip code"
        rules={[{ required: true, message: 'Please enter zip code' }]}
      />
      <ProFormText
        width="md"
        name="industry"
        label="Industry"
        placeholder="Enter industry"
        rules={[{ required: true, message: 'Please enter industry' }]}
      />
      <ProFormText width="md" name="tax_id" label="Tax ID" placeholder="Enter tax ID" />
      <ProFormText width="md" name="website" label="Website" placeholder="Enter website" />
    </ModalForm>
  );
};

export default ModalCreateBusiness;
