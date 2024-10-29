import { getDistrict, getLocations, getProvice, getWard } from '@/services/location';
import {
  ProFormCheckbox,
  ProFormDependency,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

const InfoLocation = ({ form }: any) => {
  const onRequsetLocation = async () => {
    try {
      const res = await getLocations({ international: true });
      console.log(res);
      return res?.data?.data.map((location: any) => ({
        label: `${location?.city} - ${location?.district}`,
        value: location._id,
      }));
    } catch (error) {
      return [];
    }
  };

  return (
    <ProFormGroup title="Location">
      <ProFormText hidden name="locationId" />
      <ProFormCheckbox name="international" label="Internation" width={'xl'} />
      <ProFormDependency name={['international']}>
        {({ international }) => {
          return international ? (
            <ProFormSelect
              name="location"
              label="Chọn địa điểm"
              width={'lg'}
              request={onRequsetLocation}
              rules={[
                {
                  required: true,
                  message: 'Please enter input!',
                },
              ]}
            />
          ) : (
            <ProFormGroup>
              <ProFormSelect
                showSearch
                onChange={(value) => {
                  form.setFieldsValue({ district: undefined, ward: undefined });
                }}
                allowClear
                request={async () => {
                  return await getProvice({ country: 'vietnam' })
                    .then((res) => {
                      console.log(res);
                      return res.data.map((item: any) => ({
                        value: item.value,
                        label: item.label,
                      }));
                    })
                    .catch((error) => {
                      console.log(error);
                      return [];
                    });
                }}
                width="md"
                name="city"
                label="City/Provice"
                rules={[
                  {
                    required: true,
                    message: 'Please enter input!',
                  },
                ]}
              />
              <ProFormDependency name={['city']}>
                {({ city }) => {
                  if (city) {
                    return (
                      <ProFormSelect
                        showSearch
                        key={city}
                        onChange={(value) => {
                          form.setFieldsValue({ ward: undefined });
                        }}
                        request={async () => {
                          return await getDistrict({ province: city.split('-')[0] }).then((res) => {
                            return res.data.map((item: any) => ({
                              value: item.value,
                              label: item.label,
                            }));
                          });
                        }}
                        width="md"
                        name="district"
                        label="District"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter input!',
                          },
                        ]}
                      />
                    );
                  } else {
                    return <ProFormText width="md" name="district" label="District" />;
                  }
                }}
              </ProFormDependency>
              <ProFormDependency name={['district', 'city']}>
                {({ district, city }) => {
                  if (!district || !city) {
                    return <ProFormText width="md" name="ward" label="Ward" />;
                  }
                  return (
                    <ProFormSelect
                      showSearch
                      key={district}
                      request={async () => {
                        return await getWard({ district, province: city }).then((res) => {
                          return res.data.map((item: any) => ({
                            value: item.value,
                            label: item.label,
                          }));
                        });
                      }}
                      width="md"
                      name="ward"
                      label="Ward"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter input!',
                        },
                      ]}
                    />
                  );
                }}
              </ProFormDependency>
              <ProFormText
                name="street"
                label="Stress"
                width="md"
                rules={[
                  {
                    required: true,
                    message: 'Please enter input!',
                  },
                ]}
              />
              <ProFormText
                name="longitude"
                label="Longitude"
                width="md"
                rules={[
                  {
                    required: true,
                    message: 'Please enter input!',
                  },
                ]}
              />
              <ProFormText
                name="latitude"
                label="Latitude"
                width="md"
                rules={[
                  {
                    required: true,
                    message: 'Please enter input!',
                  },
                ]}
              />
              <ProFormText
                name="gps"
                label="GPS"
                width="md"
                rules={[
                  {
                    required: true,
                    message: 'Please enter input!',
                  },
                ]}
              />
              <ProFormTextArea
                name="address"
                label="Address"
                width={1050}
                rules={[
                  {
                    required: true,
                    message: 'Please enter input!',
                  },
                ]}
              />
            </ProFormGroup>
          );
        }}
      </ProFormDependency>
    </ProFormGroup>
  );
};

export default InfoLocation;
