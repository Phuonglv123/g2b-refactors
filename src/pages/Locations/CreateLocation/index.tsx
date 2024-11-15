import {
  createLocation,
  getDistrict,
  getProvice,
  getWard,
  listCountries,
  updateLocation,
} from '@/services/location';
import { EditOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormCheckbox,
  ProFormDependency,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { useState } from 'react';

type ILocation = {
  name: string;
  city: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  longitude: string;
  latitude: string;
  street: string;
  country: string;
  status: boolean;
  international: boolean;
};

type ICreatLocationProps = {
  initValues?: any;
  type?: 'create' | 'update';
  onLoad?: any;
  locationId?: string;
};

const CreateLocation = ({ initValues, type, onLoad, locationId }: ICreatLocationProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const onFinished = async (values: ILocation) => {
    setLoading(true);
    try {
      await createLocation({
        ...values,
        country: values.international ? values?.country : 'vietnam',
      });
      message.success('Add location success');
      onLoad();
      return true;
    } catch (error) {
      message.error('Add location failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (values: ILocation) => {
    if (locationId) {
      try {
        setLoading(true);
        await updateLocation(locationId, values);
        message.success('Cập nhật địa điểm thành công');
        onLoad();
        return true;
      } catch (error) {
        //message.error('Có lỗi xảy ra');
        console.log(error);
        return true;
      } finally {
        setLoading(false);
      }
    }
  };

  const listAllCountries = async () => {
    return await listCountries().then((res) => {
      return res.data.map((item: any) => ({
        value: item._id,
        label: item.name,
      }));
    });
  };

  return (
    <ModalForm<ILocation>
      onFinish={type === 'create' ? onFinished : onUpdate}
      trigger={
        type === 'update' ? (
          <Button type="primary" icon={<EditOutlined />} />
        ) : (
          <Button type="primary" size="middle">
            Add location
          </Button>
        )
      }
      initialValues={{
        ...initValues,
        international: initValues?.country === 'vietnam' ? false : true,
      }}
      form={form}
      modalProps={{
        destroyOnClose: true,
        title: type === 'update' ? 'Update location' : 'Add location',
      }}
      loading={loading}
    >
      <ProFormCheckbox name="international" label="International" />
      <ProFormText name="code" label="Code" />
      <ProFormDependency name={['international']}>
        {({ international }) => {
          return (
            international && (
              <>
                <ProFormGroup>
                  <ProFormSelect
                    name="country"
                    label="Country"
                    request={listAllCountries}
                    width={360}
                    showSearch
                  />
                  <ProFormText name="city" label="City/Provicen" width={360} />
                </ProFormGroup>
                <ProFormGroup>
                  <ProFormText name="district" label="District" width={360} />
                  <ProFormText name="ward" label="Ward" width={360} />
                </ProFormGroup>
                <ProFormText name="street" label="Street" />
                <ProFormGroup>
                  <ProFormText name="longitude" label="Longtitude" width={360} />
                  <ProFormText name="latitude" label="Latitude" width={360} />
                </ProFormGroup>
                <ProFormTextArea name="address" label="Address" />
              </>
            )
          );
        }}
      </ProFormDependency>
      <ProFormDependency name={['international']}>
        {({ international }) => {
          return (
            !international && (
              <>
                <ProFormGroup rowProps={{ gutter: 0 }} colProps={{ span: 12 }}>
                  <ProFormSelect
                    showSearch
                    request={async () => {
                      return await getProvice({ name: 'vietnam' }).then((res) => {
                        return res.data.map((item: any) => ({
                          value: item.value,
                          label: item.label,
                        }));
                      });
                    }}
                    width={360}
                    name="city"
                    label="City/Province"
                    fieldProps={{
                      onChange: () => {
                        // Reset district and ward when city changes
                        form.setFieldsValue({ district: undefined, ward: undefined });
                      },
                    }}
                  />
                  <ProFormDependency name={['city']}>
                    {({ city }) => {
                      if (city) {
                        return (
                          <ProFormSelect
                            showSearch
                            key={city}
                            request={async () => {
                              return await getDistrict({ province_code: city }).then((res) => {
                                return res.data.map((item: any) => ({
                                  value: item.value,
                                  label: item.label,
                                }));
                              });
                            }}
                            width={360}
                            name="district"
                            label="District"
                            fieldProps={{
                              onChange: () => {
                                // Reset district and ward when city changes
                                form.setFieldsValue({ ward: undefined });
                              },
                            }}
                          />
                        );
                      } else {
                        return <ProFormText width="md" name="district" label="District" />;
                      }
                    }}
                  </ProFormDependency>
                </ProFormGroup>
                <ProFormGroup>
                  <ProFormDependency name={['district', 'city']}>
                    {({ district, city }) => {
                      if (!district || !city) {
                        return <ProFormText width="md" name="ward" label="Ward" />;
                      }
                      return (
                        <ProFormSelect
                          key={district}
                          showSearch
                          request={async () => {
                            return await getWard({}).then((res) => {
                              return res.data.map((item: any) => ({
                                value: item.value,
                                label: item.label,
                              }));
                            });
                          }}
                          width={360}
                          name="ward"
                          label="Ward"
                        />
                      );
                    }}
                  </ProFormDependency>
                </ProFormGroup>
                <ProFormText name="street" label="Street" />

                <ProFormGroup>
                  <ProFormText name="longitude" label="Longitude" width={360} />
                  <ProFormText name="latitude" label="Latitude" width={360} />
                </ProFormGroup>
                <ProFormTextArea name="address" label="Address" />
              </>
            )
          );
        }}
      </ProFormDependency>
      <ProFormGroup rowProps={{ gutter: 0 }}>
        <ProFormText name="gps" label="GPS" width={360} />

        <ProFormSelect
          name="status"
          width={360}
          label="Status"
          options={[
            { label: 'InActive', value: 0 },
            { label: 'Active', value: 1 },
          ]}
        />
      </ProFormGroup>
      <ProFormTextArea name="location_description" label="Description" />
    </ModalForm>
  );
};

export default CreateLocation;
