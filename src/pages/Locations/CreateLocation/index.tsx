import {
  createLocation,
  getDistrict,
  getProvice,
  getWard,
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
      message.success('Tạo địa điểm thành công');
      onLoad();
      return true;
    } catch (error) {
      message.error('Có lỗi xảy ra');
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

  return (
    <ModalForm<ILocation>
      onFinish={type === 'create' ? onFinished : onUpdate}
      trigger={
        type === 'update' ? (
          <Button type="primary" icon={<EditOutlined />} />
        ) : (
          <Button type="primary" size="middle">
            Thêm địa điểm
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
        title: type === 'update' ? 'Cập nhật địa điểm' : 'Thêm địa điểm',
      }}
      loading={loading}
    >
      <ProFormCheckbox name="international" label="Quốc tế" />
      <ProFormText name="code" label="Code" />
      <ProFormDependency name={['international']}>
        {({ international }) => {
          return (
            international && (
              <>
                <ProFormGroup>
                  <ProFormText name="country" label="Quốc gia" width={360} />
                  <ProFormText name="city" label="Thành phố/Tỉnh" width={360} />
                </ProFormGroup>
                <ProFormGroup>
                  <ProFormText name="district" label="Quận/Huyện" width={360} />
                  <ProFormText name="ward" label="Phường/Xã" width={360} />
                </ProFormGroup>
                <ProFormText name="street" label="Tên đường" />
                <ProFormGroup>
                  <ProFormText name="longitude" label="Kinh độ" width={360} />
                  <ProFormText name="latitude" label="Vĩ độ" width={360} />
                </ProFormGroup>
                <ProFormTextArea name="address" label="Địa chỉ" />
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
                      return await getProvice({ country: 'vietnam' }).then((res) => {
                        return res.data.map((item: any) => ({
                          value: item.value,
                          label: item.label,
                        }));
                      });
                    }}
                    width={360}
                    name="city"
                    label="Thành phố/Tỉnh"
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
                              return await getDistrict({ province: city }).then((res) => {
                                return res.data.map((item: any) => ({
                                  value: item.value,
                                  label: item.label,
                                }));
                              });
                            }}
                            width={360}
                            name="district"
                            label="Quận/Huyện"
                            fieldProps={{
                              onChange: () => {
                                // Reset district and ward when city changes
                                form.setFieldsValue({ ward: undefined });
                              },
                            }}
                          />
                        );
                      } else {
                        return <ProFormText width="md" name="district" label="Quận/Huyện" />;
                      }
                    }}
                  </ProFormDependency>
                </ProFormGroup>
                <ProFormGroup>
                  <ProFormDependency name={['district', 'city']}>
                    {({ district, city }) => {
                      if (!district || !city) {
                        return <ProFormText width="md" name="ward" label="Phường/Xã" />;
                      }
                      return (
                        <ProFormSelect
                          key={district}
                          showSearch
                          request={async () => {
                            return await getWard({ district, province: city }).then((res) => {
                              return res.data.map((item: any) => ({
                                value: item.value,
                                label: item.label,
                              }));
                            });
                          }}
                          width={360}
                          name="ward"
                          label="Phường/Xã"
                        />
                      );
                    }}
                  </ProFormDependency>
                </ProFormGroup>
                <ProFormText name="street" label="Tên đường" />

                <ProFormGroup>
                  <ProFormText name="longitude" label="Kinh độ" width={360} />
                  <ProFormText name="latitude" label="Vĩ độ" width={360} />
                </ProFormGroup>
                <ProFormTextArea name="address" label="Địa chỉ" />
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
          label="Trạng thái"
          options={[
            { label: 'Không hoạt động', value: 0 },
            { label: 'Hoạt động', value: 1 },
          ]}
        />
      </ProFormGroup>
      <ProFormTextArea name="location_description" label="Mô tả vị trí" />
    </ModalForm>
  );
};

export default CreateLocation;
