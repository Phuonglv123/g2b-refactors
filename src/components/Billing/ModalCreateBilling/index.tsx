import { listProducts } from '@/services/products';
import {
  ProForm,
  ProFormDependency,
  ProFormGroup,
  ProFormRadio,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Modal, Steps } from 'antd';
import { useState } from 'react';

const ModalCreateBilling = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>([]);
  const [business, setBusiness] = useState<any>(null);

  const onRequest = async (params: any, filter: any, sort: any) => {
    console.log(params, filter, sort);
    const { product_code, product_name, country, city, district, ward } = params;
    const { status, type, areas, provider } = sort;
    const payload: any = {
      size: params.pageSize,
      page: params.current,
      product_code,
      product_name,
      country: country === 'vietnam' ? 'Việt nam' : country,
      city,
      district,
      ward,
    };
    if (status) {
      payload.status = status[0];
    }
    if (type) {
      payload.type = type.join(',');
    }
    if (areas) {
      payload.areas = areas.join(',');
    }

    if (provider) {
      payload.provider = provider.join(',');
    }

    const data = await listProducts(payload);
    return {
      data: data.data,
      total: data.pagination.total,
    };
  };
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Create Billing
      </Button>
      <Modal open={visible} onCancel={() => setVisible(false)} width={1200} footer={null}>
        <Steps
          current={0}
          onChange={(current) => {
            setStep(current);
          }}
          items={[
            {
              title: 'Information Customer',
              description: "Form to input customer's information.",
            },
            {
              title: 'Select Product',
              description: "Table to select customer's product.",
            },
            {
              title: 'Verify Information',
              description: 'Verify information before create billing.',
            },
          ]}
        />
        {step === 0 && (
          <div>
            <ProForm
              onFinish={async (values) => {
                setStep(1);
                setBusiness(values);
              }}
              initialValues={{
                type: 'new',
              }}
            >
              <ProFormRadio.Group
                name="type"
                label="Customer Type"
                options={[
                  {
                    label: 'New Customer',
                    value: 'new',
                  },
                  {
                    label: 'Old Customer',
                    value: 'old',
                  },
                ]}
              />
              <ProFormDependency name={['type']}>
                {({ type }) => {
                  if (type === 'old') {
                    return (
                      <ProFormText
                        width={'xl'}
                        name="business_id"
                        label="Company Name"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your customer ID!',
                          },
                        ]}
                      />
                    );
                  }
                  return null;
                }}
              </ProFormDependency>
              <ProFormGroup>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return (
                        <ProFormText
                          width={550}
                          name="company_name"
                          label="Company Name"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your customer name!',
                            },
                          ]}
                        />
                      );
                    }
                    return null;
                  }}
                </ProFormDependency>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return (
                        <ProFormText
                          width={550}
                          name="contact_person"
                          label="Contact Person"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your contact person!',
                            },
                          ]}
                        />
                      );
                    }
                    return null;
                  }}
                </ProFormDependency>
              </ProFormGroup>
              <ProForm.Group>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return (
                        <ProFormText
                          width={550}
                          name="email"
                          label="Email"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your email!',
                            },
                          ]}
                        />
                      );
                    }
                    return null;
                  }}
                </ProFormDependency>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return (
                        <ProFormText
                          width={550}
                          name="phone_number"
                          label="Phone Number"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your phone number!',
                            },
                          ]}
                        />
                      );
                    }
                    return null;
                  }}
                </ProFormDependency>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return (
                        <ProFormText
                          width={550}
                          name="address"
                          label="Address"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your address!',
                            },
                          ]}
                        />
                      );
                    }
                    return null;
                  }}
                </ProFormDependency>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return (
                        <ProFormText
                          width={550}
                          name="country"
                          label="Country"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your country!',
                            },
                          ]}
                        />
                      );
                    }
                    return null;
                  }}
                </ProFormDependency>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return (
                        <ProFormText
                          width={550}
                          name="city"
                          label="City"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your city!',
                            },
                          ]}
                        />
                      );
                    }
                    return null;
                  }}
                </ProFormDependency>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return (
                        <ProFormText
                          width={550}
                          name="zip_code"
                          label="Zip Code"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your zip code!',
                            },
                          ]}
                        />
                      );
                    }
                    return null;
                  }}
                </ProFormDependency>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return (
                        <ProFormText
                          width={550}
                          name="industry"
                          label="Industry"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your industry!',
                            },
                          ]}
                        />
                      );
                    }
                    return null;
                  }}
                </ProFormDependency>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return <ProFormText width={550} name="tax_id" label="Tax ID" />;
                    }
                    return null;
                  }}
                </ProFormDependency>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    if (type === 'new') {
                      return <ProFormText width={550} name="website" label="Website" />;
                    }
                    return null;
                  }}
                </ProFormDependency>
              </ProForm.Group>
            </ProForm>
          </div>
        )}
        {step === 1 && (
          <div>
            <ProTable
              request={onRequest}
              columns={[
                {
                  title: 'Product',
                  dataIndex: 'name',
                  key: 'product',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                },
                {
                  title: 'Tax',
                  dataIndex: 'tax',
                  key: 'tax',
                },
              ]}
            />
          </div>
        )}
        {step === 2 && <div>Step 3</div>}
      </Modal>
    </>
  );
};

export default ModalCreateBilling;
